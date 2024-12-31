"use client";

import { Suspense, useEffect, useRef } from "react";
import Header from "./ui/header";
import "./underline.css";
import { HowToInputClan } from "./ui/howToInputClan";
import { useSearchParams } from "next/navigation";
import KofiButton from "kofi-button";
import Link from "next/link";
import { ClanNameSearch } from "./ui/clanNameSearch";
import { FaTiktok } from "react-icons/fa";

function SearchClanTag() {
  const linkRef = useRef<string>("");
  const searchParams = useSearchParams();

  function search(formData: any) {
    //console.log("in search function");
    let response: string = formData.get("query");
    response = response.toUpperCase();
    response = response.replace(/\s+/g, "");
    //console.log(response);
    if (response.charAt(0) == "#") {
      response = response.slice(1);
    }
    if (response != "" || response != undefined) {
      window.location.href = "/" + linkRef.current + "?clan-tag=" + response;
    }
  }

  return (
    <form action={search} className="flex flex-col items-center">
      <input
        name="query"
        type="text"
        defaultValue={
          searchParams.get("clan-tag")?.toString() != undefined &&
          searchParams.get("clan-tag")?.toString() != ""
            ? searchParams.get("clan-tag")?.toString()
            : ""
        }
        placeholder="Enter Clan Tag (Ex. Q8UGY2V2)"
        className="bg-white border-solid border-gray-300 px-3 w-full max-w-72 h-8 rounded-md border block text-center "
      />
      <div className="block w-full justify-center mt-2">
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-1 mb-2 w-28"
          onClick={() => (linkRef.current = "clan-table")}
        >
          Clan Table
        </button>
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-1 mb-2 w-28"
          onClick={() => (linkRef.current = "war-stats")}
        >
          War Stats
        </button>
      </div>
    </form>
  );
}

function PrivacyPolicyLink() {
  const searchParams = useSearchParams();
  return (
    <Link
      href={
        "/privacy-policy" +
        (searchParams.get("clan-tag")?.toString() != undefined &&
        searchParams.get("clan-tag")?.toString() != ""
          ? "?clan-tag=" + searchParams.get("clan-tag")?.toString()
          : "")
      }
      className="text-xs hover:text-blue-400 hover:underline cursor-pointer"
    >
      Privacy Policy
    </Link>
  );
}

export default function Home() {
  // used to get rid of tiny horizontal scrollbar
  useEffect(() => {
    document.body.style.overflowX = "hidden";
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Suspense>
        <Header />
      </Suspense>
      <div className="mx-2 flex flex-col justify-center items-center text-center">
        <div className="underline-css w-full flex items-center justify-center">
          <h1 className="w-full text-center text-5xl md:text-6xl font-bold mt-20 md:mt-28 leading-tight">
            Royale Clan Manager
          </h1>
        </div>

        <h2 className="text-center font-semibold text-lg mt-10 mb-8">
          Track clan member&apos;s participations and see the chance of winning the war week!
        </h2>
            <ClanNameSearch defaultValue={""} />
        <p className="text-center mt-2 mb-3 text-base font-semibold">or</p>
        <div className="text-center w-full">
          <Suspense>
            <SearchClanTag />
          </Suspense>
        </div>
        <div className="mt-10">
          <p className="text-center mb-2 mx-2 underline underline-offset-4 text-lg">
            How to find your clan tag
          </p>
          <div className="w-full flex justify-center text-center">
            <div className="flex aspect-square max-w-xl w-full justify-center rounded-md overflow-hidden ">
              <HowToInputClan />
            </div>
          </div>
          <div className="mt-20 max-w-4xl">
            <div className="mb-16">
              <p className="font-semibold text-xl">Welcome to Royale Clan Manger!</p>
              <p className="mt-4">
                Created to help clan leaders see who is participating in wars and help predict where a clan
                should be placing in war battles.
              </p>
            </div>
            <div>
              <p className="font-semibold text-xl">Analyze Clan Performance and Predict War Outcomes</p>
              <p className="mt-4">
                With the <b>Clan Table</b>, you can effortlessly track each member&apos;s individual war participation by simply clicking on their name. Gain valuable insights 
                into your clan&apos;s overall performance and strategize effectively for upcoming battles.
              </p>
              <p className="mt-4">       
                Using <b>War Stats</b>, see your clan&apos;s probability of victory in the next battle week. These metrics combine the total player contributions and historical 
                statistics to help you determine where you should be placing in your clan wars.
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col align-middle justify-center text-center mt-20 mb-10">
            <p>Follow us on TikTok!</p>
            <div className="flex w-full justify-center ">
              <a
                href="https://www.tiktok.com/@canadian.power"
                className="rounded-full  aspect-square"
                rel="noreferrer noopener"
                target="_blank"
              >
                <FaTiktok className="w-20 h-20 mt-4 bg-blue-200 rounded-full p-4 overflow-visible" />
              </a>
            </div>
          </div>

          <div className="w-full flex text-center justify-center mt-16 mb-2">
            <Suspense>
              <PrivacyPolicyLink />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
