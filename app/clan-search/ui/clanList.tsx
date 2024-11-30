"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import testData from "../testData";
import { ClanNameSearch } from "@/app/ui/clanNameSearch";
import { ClanTagSearch } from "@/app/ui/clanTagSearch";
import { MagnifyingGlass } from "react-loader-spinner";
import Image from "next/image";

export default function ClanList({ getData }: { getData: any }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        if (searchParams.get("clan-name")?.toString()) {
          if (
            searchParams.get("clan-name")?.toString() === "" ||
            searchParams.get("clan-name")?.toString().length === 1 ||
            searchParams.get("clan-name")?.toString().length === 2
          ) {
            //console.log("clan-tag is empty");
            setData([]);
          } else {
            //await new Promise((resolve) => setTimeout(resolve, 3000));
            console.log(searchParams.get("clan-name")?.toString());
            console.log(
              "api/get-clan-list/" + // @ts-ignore
                encodeURI(searchParams.get("clan-name")?.toString())
            );

            const result = await fetch(
              "api/get-clan-list/" +
                // @ts-ignore
                encodeURI(searchParams.get("clan-name")?.toString())
            );

            let initialData = await result.json();

            if (initialData === undefined) {
              //console.log("initialData undefined, reloading page");
              location.reload();
              //console.log("initialData undefined, just reloaded the page");
            } else {
              setData(initialData);
            }
          }
        }
        setIsLoading(false);
      } catch (err: any) {
        setIsError(true);
        console.error(err);
      }
    })();
  }, []);

  function ClanItem({ clanName, clanTag, clanBadgeURL }) {
    return (
      <div className="mt-3 flex items-center justify-center w-[370px] xsm:w-[385px] md:w-[500px]">
        <div className="flex-start flex h-24 flex-row rounded-md outline outline-2 w-[370px] xsm:w-[385px] md:w-[500px]">
          <img src={clanBadgeURL} className="my-2 ml-1 xsm:ml-3" />
          <div className="my-2 ml-1 xsm:ml-3 flex flex-col">
            <p className="text-xl font-semibold leading-7 text-nowrap">
              {clanName}
            </p>
            <p className="text-md">Tag: {clanTag}</p>
          </div>
          <div className="mx-3 my-2 flex flex-1 flex-col items-end">
            <a
              href={"clan-table?clan-tag=" + clanTag.slice(1)}
              className="flex mb-1 h-1/2 w-24 md:w-32 rounded-sm outline outline-1 hover:bg-slate-100 justify-center items-center"
            >
              Clan Table
            </a>
            <a
              href={"war-stats?clan-tag=" + clanTag.slice(1)}
              className="flex mt-1 h-1/2 w-24 md:w-32 rounded-sm outline outline-1 hover:bg-slate-100 justify-center items-center"
            >
              War Stats
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-2">
        <p>An unexpected error has occured, please try again shortly</p>
      </div>
    );
  } else if (isLoading) {
    return (
      <div>
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    );
  } else if (
    data.length === 0 &&
    searchParams.get("clan-name")?.toString() &&
    searchParams.get("clan-name")?.toString() != ""
  ) {
    return (
      <div className="w-screen flex justify-center flex-col">
        <div className="flex justify-center mr-12">
          <div className="mb-6">
            <ClanNameSearch
              defaultValue={searchParams.get("clan-name")?.toString()}
            />
          </div>
        </div>
        <p className="text-center text-lg">No clans found</p>
        <div className="flex justify-center">
          <div>
            <Image
              className="flex"
              src="/crying-skeleton.png"
              width={300}
              height={300}
              alt="Crying skeleton emote"
            />
          </div>
        </div>
      </div>
    );
  } else if (
    !searchParams.get("clan-name")?.toString() ||
    searchParams.get("clan-name")?.toString() === ""
  ) {
    return (
      <div className="w-screen flex justify-center flex-col">
        <div className="flex justify-center mr-12">
          <div className="mb-6">
            <ClanNameSearch
              defaultValue={searchParams.get("clan-name")?.toString()}
            />
          </div>
        </div>
        <p className="text-center text-lg">Please enter a clan name</p>
      </div>
    );
  } else {
    return (
      <>
        <div className="w-screen flex justify-center flex-col">
          <div className="flex justify-center mr-12">
            <div className="mb-6">
              <ClanNameSearch
                defaultValue={searchParams.get("clan-name")?.toString()}
              />
            </div>
          </div>
          {data.map((clan, index) => {
            return (
              <div className="w-full flex justify-center" key={index}>
                <ClanItem
                  key={index}
                  clanName={clan.clanName}
                  clanTag={clan.clanTag}
                  clanBadgeURL={clan.clanBadgeURL}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
