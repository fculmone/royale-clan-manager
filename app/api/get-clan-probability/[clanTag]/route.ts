import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(request: Request, context: any) {
  const { params } = context;
  const clanTag = params.clanTag;
  const clanData = await getClanProbability(clanTag);
  return NextResponse.json(clanData);
}

async function getClanFameHistory(clanTag: string): Promise<any[]> {
  var clanFameHistory: any[] = [];

  // get the riverrace log
  const CLASH_API_KEY = process.env.CLASH_API_KEY;
  const baseUrl = "https://api.clashroyale.com/v1";
  const riverraceLogEndpoint = `/clans/${clanTag}/riverracelog?limit=10`;

  // get the riverrace Log
  var riverraceLog;
  try {
    riverraceLog = await axios.get(baseUrl + riverraceLogEndpoint, {
      headers: {
        Authorization: `Bearer ${CLASH_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // This should never happened since we checked if clan was in a river race
    //  before this was called, and the riverrace history should just be empty
    // return clanTag + " clan not in riverrace";
    // I commented this out since it interferes with typscript
  }

  riverraceLog = riverraceLog.data;

  var clanName = "";
  var mostRecentWeek = [
    riverraceLog["items"][0]["seasonId"],
    riverraceLog["items"][0]["sectionIndex"],
  ];

  for (const war of riverraceLog["items"]) {
    for (const standing of war["standings"]) {
      if (standing["clan"]["tag"].slice(1) === clanTag.slice(3)) {
        var totalFame = 0;
        clanName = standing["clan"]["name"];
        for (const participant of standing["clan"]["participants"]) {
          totalFame += participant["fame"];
        }
        // check to see if clan finished early and account for total points
        //  that could have been won based on average
        // Define the two timestamps
        const finishDateString: string = standing["clan"]["finishTime"];
        const endDateString: string = war["createdDate"];

        const finishYear = parseInt(finishDateString.slice(0, 4));
        const finishMonthIndex = parseInt(finishDateString.slice(4, 6)) - 1;
        const finishDay = parseInt(finishDateString.slice(6, 8));
        const endYear = parseInt(endDateString.slice(0, 4));
        const endMonthIndex = parseInt(endDateString.slice(4, 6)) - 1;
        const endDay = parseInt(endDateString.slice(6, 8));

        const finishDate: Date = new Date(
          finishYear,
          finishMonthIndex,
          finishDay
        );
        const endDate: Date = new Date(endYear, endMonthIndex, endDay);

        const differenceInMilliseconds: number =
          endDate.getTime() - finishDate.getTime();
        const differenceInDays: number =
          differenceInMilliseconds / (1000 * 60 * 60 * 24);

        if (
          Math.round(differenceInDays) >= 1 &&
          Math.round(differenceInDays) <= 4
        ) {
          let daysInWar = 4 - differenceInDays;
          let averageFamePerDay = Math.round(totalFame / daysInWar);
          for (let i = 0; i < differenceInDays; ++i) {
            totalFame += averageFamePerDay;
          }
        }

        clanFameHistory.push(totalFame);
      }
    }
  }

  return [clanFameHistory, clanName, mostRecentWeek];
}

function mean(nums: number[]): number {
  const len = nums.length;
  let sum = 0;
  for (let i = 0; i < len; ++i) {
    sum += nums[i];
  }
  return sum / len;
}

// sample variance
function variance(nums: number[], mean: number): number {
  let series = 0; // series is SUM[(nums[i] - mean)]^2
  const len = nums.length;
  for (let i = 0; i < len; ++i) {
    series += (nums[i] - mean) * (nums[i] - mean);
  }
  return series / (len - 1);
}

function calcProbabilitiesForFive(
  mainClanFameHistory,
  otherClansFameHistory
): number[] {
  let aMean = mean(mainClanFameHistory[0]);
  let aVar = variance(mainClanFameHistory[0], aMean);
  let bMean = mean(otherClansFameHistory[0][0]);
  let bVar = variance(otherClansFameHistory[0][0], bMean);
  let cMean = mean(otherClansFameHistory[1][0]);
  let cVar = variance(otherClansFameHistory[1][0], cMean);
  let dMean = mean(otherClansFameHistory[2][0]);
  let dVar = variance(otherClansFameHistory[2][0], dMean);
  let eMean = mean(otherClansFameHistory[3][0]);
  let eVar = variance(otherClansFameHistory[3][0], eMean);
  // a is the random variable for the main clan, b is the random variable for index 0 of other clans array,
  // c is the random variable for index 1 of the other clans array, and so on ...
  let cdfs = {
    "a>b": 0,
    "a>c": 0,
    "a>d": 0,
    "a>e": 0,
  };

  // fill cdfs
  //   the curr_mean and curr_var are for the new random variable D where D = A - B
  //   since to calculate P(A>B), we need P(A-B>0)
  let currMean = 0;
  let currVar = 0;

  var ztable = require("ztable");

  currMean = aMean - bMean;
  currVar = aVar + bVar;
  let zScore = (0 - currMean) / Math.sqrt(currVar);
  let prob = 1 - ztable(zScore);
  cdfs["a>b"] = prob;

  currMean = aMean - cMean;
  currVar = aVar + cVar;
  zScore = (0 - currMean) / Math.sqrt(currVar);
  prob = 1 - ztable(zScore);
  cdfs["a>c"] = prob;

  currMean = aMean - dMean;
  currVar = aVar + dVar;
  zScore = (0 - currMean) / Math.sqrt(currVar);
  prob = 1 - ztable(zScore);
  cdfs["a>d"] = prob;

  currMean = aMean - eMean;
  currVar = aVar + eVar;
  zScore = (0 - currMean) / Math.sqrt(currVar);
  prob = 1 - ztable(zScore);
  cdfs["a>e"] = prob;

  let firstProb = cdfs["a>b"] * cdfs["a>c"] * cdfs["a>d"] * cdfs["a>e"];

  let secondProb = (1 - cdfs["a>b"]) * cdfs["a>c"] * cdfs["a>d"] * cdfs["a>e"];
  secondProb += (1 - cdfs["a>c"]) * cdfs["a>b"] * cdfs["a>d"] * cdfs["a>e"];
  secondProb += (1 - cdfs["a>d"]) * cdfs["a>c"] * cdfs["a>b"] * cdfs["a>e"];
  secondProb += (1 - cdfs["a>e"]) * cdfs["a>c"] * cdfs["a>d"] * cdfs["a>b"];

  let thirdProb =
    (1 - cdfs["a>b"]) * (1 - cdfs["a>c"]) * cdfs["a>d"] * cdfs["a>e"];
  thirdProb +=
    (1 - cdfs["a>b"]) * (1 - cdfs["a>d"]) * cdfs["a>c"] * cdfs["a>e"];
  thirdProb +=
    (1 - cdfs["a>b"]) * (1 - cdfs["a>e"]) * cdfs["a>c"] * cdfs["a>d"];
  thirdProb +=
    (1 - cdfs["a>c"]) * (1 - cdfs["a>d"]) * cdfs["a>b"] * cdfs["a>e"];
  thirdProb +=
    (1 - cdfs["a>c"]) * (1 - cdfs["a>e"]) * cdfs["a>b"] * cdfs["a>d"];
  thirdProb +=
    (1 - cdfs["a>d"]) * (1 - cdfs["a>e"]) * cdfs["a>b"] * cdfs["a>c"];

  let fourthProb =
    cdfs["a>b"] * (1 - cdfs["a>c"]) * (1 - cdfs["a>d"]) * (1 - cdfs["a>e"]);
  fourthProb +=
    cdfs["a>c"] * (1 - cdfs["a>b"]) * (1 - cdfs["a>d"]) * (1 - cdfs["a>e"]);
  fourthProb +=
    cdfs["a>d"] * (1 - cdfs["a>c"]) * (1 - cdfs["a>b"]) * (1 - cdfs["a>e"]);
  fourthProb +=
    cdfs["a>e"] * (1 - cdfs["a>c"]) * (1 - cdfs["a>d"]) * (1 - cdfs["a>b"]);

  let fifthProb =
    (1 - cdfs["a>b"]) *
    (1 - cdfs["a>c"]) *
    (1 - cdfs["a>d"]) *
    (1 - cdfs["a>e"]);

  return [firstProb, secondProb, thirdProb, fourthProb, fifthProb];
}

function calcProbabilitiesForFour(
  mainClanFameHistory,
  otherClansFameHistory
): number[] {
  let aMean = mean(mainClanFameHistory[0]);
  let aVar = variance(mainClanFameHistory[0], aMean);
  let bMean = mean(otherClansFameHistory[0][0]);
  let bVar = variance(otherClansFameHistory[0][0], bMean);
  let cMean = mean(otherClansFameHistory[1][0]);
  let cVar = variance(otherClansFameHistory[1][0], cMean);
  let dMean = mean(otherClansFameHistory[2][0]);
  let dVar = variance(otherClansFameHistory[2][0], dMean);
  // a is the random variable for the main clan, b is the random variable for index 0 of other clans array,
  // c is the random variable for index 1 of the other clans array, and so on ...
  let cdfs = {
    "a>b": 0,
    "a>c": 0,
    "a>d": 0,
  };

  // fill cdfs
  //   the curr_mean and curr_var are for the new random variable D where D = A - B
  //   since to calculate P(A>B), we need P(A-B>0)
  let currMean = 0;
  let currVar = 0;

  var ztable = require("ztable");

  currMean = aMean - bMean;
  currVar = aVar + bVar;
  let zScore = (0 - currMean) / Math.sqrt(currVar);
  let prob = 1 - ztable(zScore);
  cdfs["a>b"] = prob;

  currMean = aMean - cMean;
  currVar = aVar + cVar;
  zScore = (0 - currMean) / Math.sqrt(currVar);
  prob = 1 - ztable(zScore);
  cdfs["a>c"] = prob;

  currMean = aMean - dMean;
  currVar = aVar + dVar;
  zScore = (0 - currMean) / Math.sqrt(currVar);
  prob = 1 - ztable(zScore);
  cdfs["a>d"] = prob;

  let firstProb = cdfs["a>b"] * cdfs["a>c"] * cdfs["a>d"];

  let secondProb = (1 - cdfs["a>b"]) * cdfs["a>c"] * cdfs["a>d"];
  secondProb += (1 - cdfs["a>c"]) * cdfs["a>b"] * cdfs["a>d"];
  secondProb += (1 - cdfs["a>d"]) * cdfs["a>c"] * cdfs["a>b"];

  let thirdProb = (1 - cdfs["a>b"]) * (1 - cdfs["a>c"]) * cdfs["a>d"];
  thirdProb += (1 - cdfs["a>b"]) * (1 - cdfs["a>d"]) * cdfs["a>c"];
  thirdProb += (1 - cdfs["a>c"]) * (1 - cdfs["a>d"]) * cdfs["a>b"];

  let fourthProb = (1 - cdfs["a>b"]) * (1 - cdfs["a>c"]) * (1 - cdfs["a>d"]);

  return [firstProb, secondProb, thirdProb, fourthProb];
}

function calcProbabilitiesForThree(
  mainClanFameHistory,
  otherClansFameHistory
): number[] {
  let aMean = mean(mainClanFameHistory[0]);
  let aVar = variance(mainClanFameHistory[0], aMean);
  let bMean = mean(otherClansFameHistory[0][0]);
  let bVar = variance(otherClansFameHistory[0][0], bMean);
  let cMean = mean(otherClansFameHistory[1][0]);
  let cVar = variance(otherClansFameHistory[1][0], cMean);
  // a is the random variable for the main clan, b is the random variable for index 0 of other clans array,
  // c is the random variable for index 1 of the other clans array, and so on ...
  let cdfs = {
    "a>b": 0,
    "a>c": 0,
  };

  // fill cdfs
  //   the curr_mean and curr_var are for the new random variable D where D = A - B
  //   since to calculate P(A>B), we need P(A-B>0)
  let currMean = 0;
  let currVar = 0;

  var ztable = require("ztable");

  currMean = aMean - bMean;
  currVar = aVar + bVar;
  let zScore = (0 - currMean) / Math.sqrt(currVar);
  let prob = 1 - ztable(zScore);
  cdfs["a>b"] = prob;

  currMean = aMean - cMean;
  currVar = aVar + cVar;
  zScore = (0 - currMean) / Math.sqrt(currVar);
  prob = 1 - ztable(zScore);
  cdfs["a>c"] = prob;

  let firstProb = cdfs["a>b"] * cdfs["a>c"];

  let secondProb = (1 - cdfs["a>b"]) * cdfs["a>c"];
  secondProb += (1 - cdfs["a>c"]) * cdfs["a>b"];

  let thirdProb = (1 - cdfs["a>b"]) * (1 - cdfs["a>c"]);

  return [firstProb, secondProb, thirdProb];
}

function calcProbabilitiesForTwo(
  mainClanFameHistory,
  otherClansFameHistory
): number[] {
  let aMean = mean(mainClanFameHistory[0]);
  let aVar = variance(mainClanFameHistory[0], aMean);
  let bMean = mean(otherClansFameHistory[0][0]);
  let bVar = variance(otherClansFameHistory[0][0], bMean);
  // a is the random variable for the main clan, b is the random variable for index 0 of other clans array,
  // c is the random variable for index 1 of the other clans array, and so on ...
  let cdfs = {
    "a>b": 0,
  };

  // fill cdfs
  //   the curr_mean and curr_var are for the new random variable D where D = A - B
  //   since to calculate P(A>B), we need P(A-B>0)
  let currMean = 0;
  let currVar = 0;

  var ztable = require("ztable");

  currMean = aMean - bMean;
  currVar = aVar + bVar;
  let zScore = (0 - currMean) / Math.sqrt(currVar);
  let prob = 1 - ztable(zScore);
  cdfs["a>b"] = prob;

  let firstProb = cdfs["a>b"];

  let secondProb = 1 - cdfs["a>b"];

  return [firstProb, secondProb];
}

async function getClanProbability(clanTag: string) {
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
  const riverraceLogEndpoint = `/clans/${clanTag}/currentriverrace`;

  // check if the clan is in a riverrace
  let currRiverrace;
  try {
    currRiverrace = await axios.get(baseUrl + riverraceLogEndpoint, {
      headers: {
        Authorization: `Bearer ${CLASH_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return clanTag + " clan not in riverrace";
  }

  currRiverrace = currRiverrace.data;

  try {
    let mainClanFameHistory: any[] = await getClanFameHistory(clanTag);

    let otherClansFameHistory: any[][] = [];
    for (const clan of currRiverrace["clans"]) {
      if (clan["tag"].slice(1) !== clanTag.slice(3)) {
        let otherClanTag = "%23" + clan["tag"].slice(1);
        let otherClanHistory: any[] = await getClanFameHistory(otherClanTag);
        otherClansFameHistory.push(otherClanHistory);
      }
    }

    let isOneClanHistoryless = false;
    if (mainClanFameHistory[0].length === 0) {
      isOneClanHistoryless = true;
    }
    for (const clanHistory of otherClansFameHistory) {
      if (clanHistory[0].length === 0) {
        isOneClanHistoryless = true;
      }
    }

    let probabilities: number[] = [];

    if (!isOneClanHistoryless) {
      if (otherClansFameHistory.length === 4) {
        probabilities = calcProbabilitiesForFive(
          mainClanFameHistory,
          otherClansFameHistory
        );
      } else if (otherClansFameHistory.length === 3) {
        probabilities = calcProbabilitiesForFour(
          mainClanFameHistory,
          otherClansFameHistory
        );
      } else if (otherClansFameHistory.length === 2) {
        probabilities = calcProbabilitiesForThree(
          mainClanFameHistory,
          otherClansFameHistory
        );
      } else if (otherClansFameHistory.length === 1) {
        probabilities = calcProbabilitiesForTwo(
          mainClanFameHistory,
          otherClansFameHistory
        );
      }
    }

    let seasonId = mainClanFameHistory[2][0];
    let sectionIndex = mainClanFameHistory[2][1];
    let labels: string[] = [];

    while (labels.length < 10) {
      let currLabel = seasonId.toString() + "-" + sectionIndex.toString();
      labels.push(currLabel);
      if (sectionIndex != 0) {
        sectionIndex -= 1;
      } else {
        seasonId -= 1;
        sectionIndex = 3;
      }
    }

    // remove the most recent clan label from the clan data cause its no longer needed
    mainClanFameHistory.pop();

    // organize the graph data so that all the histories are of length 10
    while (mainClanFameHistory[0].length < 10) {
      mainClanFameHistory[0].push(0);
    }

    for (let clanHistory of otherClansFameHistory) {
      while (clanHistory[0].length < 10) {
        clanHistory[0].push(0);
      }
    }

    labels.reverse();

    mainClanFameHistory[0].reverse();

    for (let clanHistory of otherClansFameHistory) {
      clanHistory[0].reverse();
    }

    return [probabilities, mainClanFameHistory, otherClansFameHistory, labels];
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
