import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import idBadgeURLDictionary from "./idBadgeURLDictionary";

export async function GET(request: Request, context: any) {
  const { params } = context;
  const searchQuery = params.searchQuery;
  const clanData = await getClanList(searchQuery);
  return NextResponse.json(clanData);
}

async function getClanList(searchQuery: string) {
  // get key
  const CLASH_API_KEY = process.env.CLASH_API_KEY;

  // get url
  const url = `https://api.clashroyale.com/v1/clans?name=${searchQuery.replace(
    "#",
    "%23"
  )}&limit=30`;

  console.log(url);

  const clanSearchResponse = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${CLASH_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  type ClanData = {
    clanName: string;
    clanTag: string;
    clanBadgeURL: string;
  };

  let clansList: ClanData[] = [];

  for (const clan of clanSearchResponse.data.items) {
    const clanData = {
      clanName: clan.name,
      clanTag: clan.tag,
      clanBadgeURL: idBadgeURLDictionary[clan.badgeId],
    };

    clansList.push(clanData);
  }

  return clansList;
}
