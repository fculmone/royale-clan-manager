"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useMemo, useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { SortingState } from "@tanstack/react-table";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Underdog } from "next/font/google";
import { TableSkeleton } from "./skeletons";
import { WarBattleGraph } from "./warBattlesGraph";
import { ClanTagSearch } from "@/app/ui/clanTagSearch";
import { HowToInputClan } from "@/app/ui/howToInputClan";
import KofiButton from "kofi-button";
import { ClanNameSearch } from "@/app/ui/clanNameSearch";

export default function BasicTable({ getData }: { getData: any }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [clanName, setClanName] = useState<string>();
  const [prevTag, setPrevTag] = useState<string | undefined>("");
  // prettier-ignore
  const [graphData, setGraphData] = useState<any[]>([{
    "Name": "Daniel⚔️",
    "War Points": [500, 1500, 1400, 0],
    "War Weeks": ["106-3", "106-2", "106-1", "106-0"],
  }]); // needs an inital val for some reason
  const [isLoading, setIsLoading] = useState<boolean>(
    searchParams.get("clan-tag")?.toString() != undefined &&
      searchParams.get("clan-tag")?.toString() != ""
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const graphDivRef = useRef<any>(null);
  const playerIndexRef = useRef<number>(0);

  //makes the graph close when you click off of it
  useEffect(() => {
    const handler = (event) => {
      if (!graphDivRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

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
              if (initialData.length === 1) {
                setData(initialData);
              } else {
                setData(initialData[0]);
                setGraphData(initialData[1]);
                setClanName(initialData[2]);
              }
              setIsLoading(false);
              setPrevTag(searchParams.get("clan-tag")?.toString());
              //console.log(initialData);
            }
          }
        }
      } catch (err: any) {
        setIsError(true);
        console.error(err);
        /* It was useless. This only goes goes when the server is down or if the server is
              unreachable (ie. when there is no internet)
        //pretty sure this is useless, but in theory, it should work sometimes
        if (err.response) {
          // if there is response, it means its not a 50x, but 4xx
          console.error(err);
          console.log("should only go on 400 errors");
          throw err;
        } else {
          // gets activated on 50x errors, since no response from server
          // do whatever you want here :)
          console.error(err);
          console.log("should be a 500 timeout error. restarting page");
          location.reload();
          console.log("page reset");
        }
        */
      }
    })();
  }, []);

  // used to get rid of tiny horizontal scrollbar
  useEffect(() => {
    document.body.style.overflowX = "hidden";
  }, []);

  const openGraph = (tableColumn: number, playerIndex: number) => {
    if (tableColumn === 0) {
      playerIndexRef.current = playerIndex;
      setIsOpen(true);
      //console.log(playerIndexRef.current);
    }
  };

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
      if (response.length === 1) {
        setData(response);
        setPrevTag(formData);
      } else {
        setData(response[0]);
        setGraphData(response[1]);
        setClanName(response[2]);
        setPrevTag(formData);
      }
    }

    //console.log("finished the handle search function");
    setIsLoading(false);
  }

  /** @type import('@tanstack/react-table').ColumnDef<any> */
  const columns = [
    {
      header: "Name",
      accessorKey: "Name",
    },
    {
      header: "Trophies",
      accessorKey: "Trophies",
    },
    {
      header: "Avg War Fame",
      accessorKey: "Avg Points",
    },
    {
      header: "Total War Fame",
      accessorKey: "Points",
    },
    {
      header: "Weeks Participated",
      accessorKey: "Weeks",
    },
    {
      header: "Donations",
      accessorKey: "Donations",
    },
    {
      header: "Donations Received",
      accessorKey: "Donations Received",
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  if (isError) {
    return (
      <div>
        <p>An unexpected error has occured, please try again shortly</p>
      </div>
    );
  } else if (data.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col w-screen text-center justify-center items-center">
          <div className="flex justify-center mr-12 mb-3">
            <div className="">
              <ClanNameSearch defaultValue={""} />
            </div>
          </div>
          <ClanTagSearch
            handleSearch={handleSearch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            prevValue={prevTag}
          />
          <p className="text-center mt-6 mb-10 text-xl font-medium">
            Please enter in a clan tag
          </p>
          <p className="text-center mb-2">How to find your clan tag</p>
          <div className="flex aspect-square max-w-[450px] justify-center rounded-md overflow-hidden items-center">
            <HowToInputClan />
          </div>
        </div>
      </div>
    );
  } else if (data.length === 1 && !isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-col w-screen text-center justify-center items-center">
          <div className="flex justify-center mr-12 mb-3">
            <div className="">
              <ClanNameSearch defaultValue={""} />
            </div>
          </div>
          <ClanTagSearch
            handleSearch={handleSearch}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            prevValue={prevTag}
          />
          <p className="text-center mt-6 mx-2 mb-10 text-xl font-medium">
            The clan tag is invalid
          </p>
          <p className="text-center mb-2">How to find your clan tag</p>
          <div className="flex aspect-square max-w-[450px] justify-center rounded-md overflow-hidden items-center">
            <HowToInputClan />
          </div>
          <p className="text-center mt-10 mb-2 mx-2 text-lg font-medium">
            Pro tip:
          </p>
          <p className="text-center  mx-2 text-base max-w-[450px]">
            Often, the number zero looks like the letter O. Try switching them
            in your clan tag.
          </p>
        </div>
      </div>
    );
  } else if (isLoading) {
    return (
      <div>
        <div className="flex justify-center items-center text-center mb-10">
          <div>
            <div className="flex justify-center mr-12 mb-3">
              <div className="">
                <ClanNameSearch defaultValue={""} />
              </div>
            </div>
            <ClanTagSearch
              handleSearch={handleSearch}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              prevValue={prevTag}
            />
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  } else {
    return (
      <div>
        {/* Start of War Battle Graph*/}
        <div
          className={clsx(
            "fixed top-0 bottom-0 left-0 right-0 w-screen h-screen bg-black/80 z-20",
            {
              block: isOpen,
              hidden: !isOpen,
            }
          )}
        >
          <div className="absolute top-14 right-7">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg border-solid border-2 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex w-screen h-screen items-center justify-center ">
            <div
              ref={graphDivRef}
              className="flex bg-white h-screen w-screen max-h-[800px] max-w-[800px] items-center justify-center p-6"
            >
              <WarBattleGraph
                graphData={graphData}
                playerIndex={playerIndexRef.current}
              />
            </div>
          </div>
        </div>
        {/* End of War Battle Graph*/}
        <div className="flex justify-center items-center text-center mb-10">
          <div>
            <div className="flex justify-center mr-12 mb-3">
              <div className="">
                <ClanNameSearch defaultValue={""} />
              </div>
            </div>
            <ClanTagSearch
              handleSearch={handleSearch}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              prevValue={prevTag}
            />
          </div>
        </div>
        <p className="mt-10 mb-12 font-bold text-2xl text-center">
          {clanName}&apos;s Clan Table
        </p>
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 py-2 my-5"
            placeholder="Search for items"
          />
        </div>
        <div className="flex flex-1 overflow-x-auto shadow-md rounded-xl sm:rounded-md xl:w-[1200px] lg:w-[1000px] w-screen">
          <table className="table-auto text-sm text-center rtl:text-right text-gray-500  w-screen">
            <thead className="text-xs text-gray-700 uppercase bg-gray-400  ">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={clsx("px-6 py-3", {
                        "text-left": header.column.getIndex() === 0,
                      })}
                    >
                      {
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      }
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="odd:bg-white  even:bg-gray-200 border-t  border-gray-400"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      onClick={() => {
                        openGraph(cell.column.getIndex(), cell.row.index);
                      }}
                      className={clsx("px-6 py-4", {
                        "text-left font-bold hover:cursor-pointer":
                          cell.column.getIndex() === 0,
                        "bg-red-200":
                          cell.column.getIndex() === 2 &&
                          Number(cell.getValue()) <= 750 &&
                          data[cell.row.index].Weeks != 0,
                        "bg-yellow-200":
                          cell.column.getIndex() === 2 &&
                          Number(cell.getValue()) > 750 &&
                          Number(cell.getValue()) < 1600,
                        "bg-green-200":
                          cell.column.getIndex() === 2 &&
                          Number(cell.getValue()) >= 1600,
                      })}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="my-16 w-full flex flex-col ml-2 mr-4 justify-center items-center">
          <p className="mb-5 font-semibold text-xl text-center">
            How to Use The Clan Table
          </p>
          <p className="text-center ml-2 mr-4 text-base max-w-[900px]">
            This clan table can help determine the participation of the
            clan&apos;s members in both war battles and donations. While some
            features may not be immediately apparent, they are quite useful. One
            such feature is sorting: clicking on any title in the header row
            allows sorting in ascending and descending order. Another, more
            intriguing feature, is the bar graph that appears when you click on
            any player&apos;s name. This graph illustrates how much war fame a
            player has earned in each of the past ten war weeks. You can hover
            over or click on any individual bar to get the exact number of war
            fame gathered during that week. You can hover over or click on any
            individual bar to get the exact number of war fame gathered during
            that week.
          </p>
          <div className="w-full flex justify-center mt-14 mb-10">
            <KofiButton
              color="#29abe0"
              title="Support Me on Ko-fi"
              kofiID="C0C1XAW7Q"
            />
          </div>
        </div>
      </div>
    );
  }
}
