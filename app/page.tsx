"use client";

import { Suspense, useEffect, useRef } from "react";
import Header from "./ui/header";
import "./underline.css";
import { HowToInputClan } from "./ui/howToInputClan";
import { useSearchParams } from "next/navigation";
import KofiButton from "kofi-button";
import Link from "next/link";

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
      <div className="mx-2">
        <div className="underline-css w-full flex items-center justify-center">
          <p className="w-full text-center text-5xl md:text-6xl font-bold mt-20 md:mt-28 leading-tight">
            Royale Clan Manager
          </p>
        </div>

        <p className="text-center font-semibold text-lg mt-16">
          Quickly determine clan member&apos;s activity and war battle status
        </p>
        <div className="text-center mt-16">
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
          <div className="w-full flex justify-center mt-10 mb-10">
            <KofiButton
              color="#29abe0"
              title="Support Me on Ko-fi"
              kofiID="C0C1XAW7Q"
            />
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
