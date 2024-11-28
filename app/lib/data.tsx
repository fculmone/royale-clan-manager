"use server";

import { Fuggles } from "next/font/google";

export async function getDataFromServer(clanTag: string) {
  "use server";
  let data;
  console.log(process.env.BASE_URL + "/get-clan/" + clanTag);
  const result = await fetch(process.env.BASE_URL + "/get-clan/" + clanTag);
  data = await result.json();

  return data;
}

export async function getProbabilityDataFromServer(clanTag: string) {
  "use server";
  let data;
  //console.log(process.env.BASE_URL + '/get-clan/' + clanTag)
  const result = await fetch(
    process.env.BASE_URL + "/get-clan-probability/" + clanTag
  );
  data = await result.json();

  return data;
}
