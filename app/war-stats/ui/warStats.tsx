"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WarHistoryLineGraph } from "./warHistoryLineGraph";
import { ClanTagSearch } from "@/app/ui/clanTagSearch";
import { StatsSkeleton } from "./skeletons";
import { HowToInputClan } from "@/app/ui/howToInputClan";
import KofiButton from "kofi-button";

export default function WarStats({ getData }: { getData: any }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [prevTag, setPrevTag] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState<boolean>(
    searchParams.get("clan-tag")?.toString() != undefined &&
      searchParams.get("clan-tag")?.toString() != ""
  );
  const [isError, setIsError] = useState<boolean>(false);

  //get data at load time
  useEffect(() => {
    (async () => {
      try {
        if (searchParams.get("clan-tag")?.toString()) {
          if (searchParams.get("clan-tag")?.toString() === "") {
            //console.log("clan-tag is empty");
            setData([]);
            setIsLoading(false);
          } else {
            //await new Promise((resolve) => setTimeout(resolve, 3000));
            const initialData = await getData(
              searchParams.get("clan-tag")?.toString()
            );
            if (initialData === undefined) {
              //console.log("initialData undefined, reloading page");
              location.reload();
              //console.log("initialData undefined, just reloaded the page");
            } else {
              setData(initialData);
              setData(initialData);
              setIsLoading(false);
              setPrevTag(searchParams.get("clan-tag")?.toString());
              //console.log(initialData);
            }
          }
        }
      } catch (err: any) {
        setIsError(true);
        console.error(err);
      }
    })();
  }, []);

  // used to get rid of tiny horizontal scrollbar
  useEffect(() => {
    document.body.style.overflowX = "hidden";
  }, []);

  async function handleSearch(formData: string | undefined) {
    // for some reason, unbeknownst to me and probably God,
    //   adding the promise below adds the loading animation
    await new Promise((resolve) => setTimeout(resolve, 10));
    if (formData === "" || formData === undefined) {
      setData([]);
    } else {
      const params = new URLSearchParams(searchParams);
      if (formData) {
        params.set("clan-tag", formData);
        setPrevTag(formData);
      } else {
        params.delete("clan-tag");
      }
      replace(`${pathname}?${params.toString()}`);
      const response = await getData(formData);

      //console.log(response);
      //console.log(response.length);
      setData(response);
      setData(response);
    }

    //console.log("finished the handle search function");
    setIsLoading(false);
  }

  function Probabilities() {
    return (
      <>
        {data[0].length > 0 ? (
          <div className="text-center">
            <p className="mb-4 mx-2">
              Based on your previous clan war history, the probability of your
              rank in the next war battle is as follows:{" "}
            </p>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2">
                <div className="block text-left">1st:</div>
                <div className="block text-left">
                  {(
                    (Math.round((data[0][0] + Number.EPSILON) * 10000) /
                      10000) *
                    100
                  ).toFixed(2)}
                  %
                </div>
                <div className="block text-left">2nd:</div>
                <div className="block text-left">
                  {(
                    (Math.round((data[0][1] + Number.EPSILON) * 10000) /
                      10000) *
                    100
                  ).toFixed(2)}
                  %
                </div>
                {data[0].length > 2 && (
                  <>
                    <div className="block text-left">3rd:</div>
                    <div className="block text-left">
                      {(
                        (Math.round((data[0][2] + Number.EPSILON) * 10000) /
                          10000) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                  </>
                )}
                {data[0].length > 3 && (
                  <>
                    <div className="block text-left">4th:</div>
                    <div className="block text-left">
                      {(
                        (Math.round((data[0][3] + Number.EPSILON) * 10000) /
                          10000) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                  </>
                )}
                {data[0].length > 4 && (
                  <>
                    <div className="block text-left">5th:</div>
                    <div className="block text-left">
                      {(
                        (Math.round((data[0][4] + Number.EPSILON) * 10000) /
                          10000) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-2">
            Cannot calculate probabilities since one or more clans does not have
            any war history
          </div>
        )}
      </>
    );
  }

  if (isError) {
    return (
      <div className="mx-2">
        <p>An unexpected error has occured, please try again shortly</p>
      </div>
    );
  } else if (data.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col w-screen text-center justify-center items-center">
          <ClanTagSearch
            handleSearch={handleSearch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            prevValue={prevTag}
          />
          <p className="text-center mt-6 mb-10 text-xl mx-2 font-medium">
            Please enter in a clan tag
          </p>
          <p className="text-center mb-2 mx-2">How to find your clan tag</p>
          <div className="flex aspect-square max-w-[450px] justify-center rounded-md overflow-hidden items-center">
            <HowToInputClan />
          </div>
        </div>
      </div>
    );
  } else if (
    typeof data === "string" &&
    // @ts-ignore
    data.includes("not in riverrace") &&
    !isLoading
  ) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col w-screen text-center justify-center items-center">
          <ClanTagSearch
            handleSearch={handleSearch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            prevValue={prevTag}
          />
          <p className="text-center mt-6 mb-10 text-xl my-3 font-medium">
            Either the clan tag is invalid, or the clan is not currently in a
            river race
          </p>
          <p className="text-center mb-2">How to find your clan tag</p>
          <div className="flex aspect-square max-w-[450px] justify-center rounded-md overflow-hidden items-center">
            <HowToInputClan />
          </div>
          <p className="text-center mt-10 mb-2 text-lg font-medium">Pro tip:</p>
          <p className="text-center  text-base max-w-[450px]">
            Often, the number zero looks like the letter O. Try switching them
            in your clan tag.
          </p>
        </div>
      </div>
    );
  } else if (isLoading) {
    return (
      <div>
        <div className="text-center">
          <ClanTagSearch
            handleSearch={handleSearch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            prevValue={prevTag}
          />
        </div>

        <StatsSkeleton />
      </div>
    );
  } else {
    return (
      <div>
        <div className="grid items-center justify-center">
          <div className="flex w-full text-center h-full ">
            <ClanTagSearch
              handleSearch={handleSearch}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              prevValue={prevTag}
            />
          </div>
          <div className="flex flex-col h-screen w-screen max-h-[800px] max-w-[800px] px-1 sm:px-4 md:px-8 items-center justify-top mt-14">
            <p className=" mb-4 font-bold text-2xl text-center">
              {data[1][1]}&apos;s War Stats
            </p>
            <WarHistoryLineGraph graphData={data} />

            <div className="mt-12">
              <p className="mb-5 font-semibold text-xl text-center">
                Probabilities
              </p>
              <Probabilities />
            </div>
            <div className=" mt-16 w-full flex flex-col mx-2 justify-center items-center">
              <p className="mb-5 font-semibold text-xl text-center">
                How to Use The War Stats Chart
              </p>
              <p className="text-center mx-2 text-base max-w-[900px]">
                This chart displays the past ten weeks of war history for all of
                the clans&apos; competitors in the current war week. Each war
                week is treated as a coliseum week, where the number on the
                y-axis represents the sum of all clan members&apos; war fame.
                You can hide any clan by clicking on the clan name in the
                legend.
              </p>
            </div>
            <div className="mt-16 w-full flex flex-col mx-2 justify-center items-center">
              <p className="mb-5 font-semibold text-xl text-center">
                How is the Probability Calculated?
              </p>
              <p className="text-center mx-2 text-base max-w-[900px]">
                Note that this brief explanation delves into technical details
                and is not required to use the probabilities; it&apos;s more for
                those who are interested. Essentially, since each war week is
                treated as a coliseum week, the total war fame for each week is
                the sum of the clan members&apos; fame. With each clan usually
                containing thirty or more members, the central limit theorem
                holds. This means that we can model the probability of each
                clan&apos;s war fame per week with the normal distribution,
                which allows us to calculate the probability of one clan having
                more or less war fame than the other opposing clans.
                <br />
                &nbsp;
                <br />
                &nbsp;
              </p>
            </div>
            <div>
              <KofiButton
                color="#29abe0"
                title="Support Me on Ko-fi"
                kofiID="C0C1XAW7Q"
              />
            </div>
            <div>
              <p>
                <br />
                &nbsp;
                <br />
                &nbsp;
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
