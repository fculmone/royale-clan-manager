"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import testData from "../testData";

export default function ClanList({ getData }: { getData: any }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        if (searchParams.get("clan-name")?.toString()) {
          if (searchParams.get("clan-name")?.toString() === "") {
            //console.log("clan-tag is empty");
            setData([]);
          } else {
            //await new Promise((resolve) => setTimeout(resolve, 3000));

            const result = await fetch(
              "api/get-clan-list/" + searchParams.get("clan-name")?.toString()
            );

            let initialData = await result.json();
            console.log(initialData);

            if (initialData === undefined) {
              //console.log("initialData undefined, reloading page");
              location.reload();
              //console.log("initialData undefined, just reloaded the page");
            } else {
              setData(initialData);
              console.log(initialData);
            }
          }
        }
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

  return (
    <div className="w-max">
      {data.map((clan, index) => {
        return (
          <ClanItem
            key={index}
            clanName={clan.clanName}
            clanTag={clan.clanTag}
            clanBadgeURL={clan.clanBadgeURL}
          />
        );
      })}
    </div>
  );
}
