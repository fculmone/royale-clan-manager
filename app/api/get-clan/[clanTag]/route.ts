import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(request: Request, context: any) {
  const { params } = context;
  const clanTag = params.clanTag;
  const clanData = await getClanData(clanTag);
  return NextResponse.json(clanData);
}

async function getClanData(clanTag: string) {
  // get key
  const CLASH_API_KEY = process.env.CLASH_API_KEY;

  // configure clan tag
  clanTag = clanTag.toUpperCase();
  if (clanTag.charAt(0) === "#") {
    clanTag = clanTag.substring(1);
  }
  clanTag = "%23" + clanTag;

  // get url
  const baseUrl = "https://api.clashroyale.com/v1";
  const clanDataEndpoint = `/clans/${clanTag}/members`;
  const riverraceLogEndpoint = `/clans/${clanTag}/riverracelog?limit=10`;

  // call API
  try {
    const clanDataResponse = await axios.get(baseUrl + clanDataEndpoint, {
      headers: {
        Authorization: `Bearer ${CLASH_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    //console.log(clanDataResponse.data);

    const riverranceLogResponse = await axios.get(
      baseUrl + riverraceLogEndpoint,
      {
        headers: {
          Authorization: `Bearer ${CLASH_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    //console.log(riverranceLogResponse.data);

    interface Player {
      Name: string;
      Trophies: number;
      Points: number;
      "Avg Points": number;
      Weeks: number;
      Donations: number;
      "Donations Received": number;
    }

    interface WarHistory {
      Name: string;
      "War Weeks": string[];
      "War Points": number[];
    }

    //begin getting data
    var retval: any[] = [];
    var tableData: Player[] = [];
    var graphData: WarHistory[] = [];
    var clanName = "";

    var count = 1;

    // loop through the data
    for (const item of clanDataResponse.data.items) {
      var currentPlayer: Player = {
        Name: "",
        Trophies: 0,
        Points: 0,
        "Avg Points": 0,
        Weeks: 0,
        Donations: 0,
        "Donations Received": 0,
      };
      var currentPlayerWarHistory: WarHistory = {
        Name: "",
        "War Weeks": [],
        "War Points": [],
      };

      currentPlayer["Name"] = item.name;
      currentPlayer["Trophies"] = item.trophies;
      currentPlayer["Donations"] = item.donations;
      currentPlayer["Donations Received"] = item.donationsReceived;

      currentPlayerWarHistory["Name"] = item.name;

      // get the data for Points, Avg Points, and Weeks
      var points = 0;
      var weeks = 0;

      for (const war of riverranceLogResponse.data.items) {
        var foundPlayer = false;
        for (const standing of war["standings"]) {
          if (
            standing["clan"]["tag"].slice(1) === clanTag.slice(3) &&
            clanName === ""
          ) {
            clanName = standing["clan"]["name"];
          }
          for (const participant of standing["clan"]["participants"]) {
            if (
              participant.tag === item.tag &&
              standing.clan.tag.slice(1) === clanTag.slice(3)
            ) {
              weeks += 1;
              points += participant.fame;
              currentPlayerWarHistory["War Weeks"].push(
                war["seasonId"].toString() +
                  "-" +
                  war["sectionIndex"].toString()
              );
              currentPlayerWarHistory["War Points"].push(participant["fame"]);
              foundPlayer = true;
              break;
            }
          }
          if (foundPlayer) {
            break;
          }
        }
      }

      currentPlayer["Points"] = points;

      if (weeks !== 0) {
        currentPlayer["Avg Points"] = Math.round(points / weeks);
      } else {
        currentPlayer["Avg Points"] = points;
      }

      currentPlayer["Weeks"] = weeks;

      tableData.push(currentPlayer);
      graphData.push(currentPlayerWarHistory);
    }

    retval.push(tableData);
    retval.push(graphData);
    retval.push(clanName);
    return retval;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error:",
        error.response?.status,
        error.response?.data
      );
      if (error.response?.data.reason === "notFound") {
        var data = [clanTag];
        return data;
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
