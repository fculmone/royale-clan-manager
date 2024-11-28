"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import links from "@/app/links.json";
import { useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { useSearchParams } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  return (
    <>
      {!isOpen ? (
        <header>
          <nav className="flex flex-col w-screen z-30 bg-white border-gray-200 px-4 lg:px-6 py-2.5 border-b border-solid shadow-sm">
            <div className="flex flex-row justify-between items-center mx-auto w-full max-w-screen-2xl">
              <div className="flex">
                <a
                  href={
                    "/" +
                    (searchParams.get("clan-tag")?.toString() != undefined &&
                    searchParams.get("clan-tag")?.toString() != ""
                      ? "?clan-tag=" + searchParams.get("clan-tag")?.toString()
                      : "")
                  }
                  className="flex items-center"
                >
                  <Image
                    src="/war-shield.webp"
                    width={259}
                    height={298}
                    className="mt-2 mr-2 h-10 w-10 sm:h-14 sm:w-14 md:mr-3 object-center object-contain"
                    alt="War Shield"
                  />
                  <span className="self-center text-sm sm:text-lg lg:text-xl font-semibold">
                    Royale Clan Manager
                  </span>
                </a>
              </div>

              <div
                className={` antialiased items-center w-full flex justify-end lg:w-auto lg:order-1`}
                id="mobile-menu-2"
              >
                <ul className="hidden sm:flex sm:flex-row sm:text-sm md:font-medium md:text-base md:space-x-1 md:mt-0 lg:space-x-8">
                  {links.map((link) => {
                    return (
                      <li key={`li-element-${link.name}`}>
                        <Link
                          key={link.name}
                          href={
                            link.href +
                            (searchParams.get("clan-tag")?.toString() !=
                              undefined &&
                            searchParams.get("clan-tag")?.toString() != ""
                              ? "?clan-tag=" +
                                searchParams.get("clan-tag")?.toString()
                              : "")
                          }
                          className={clsx("flex py-2 pr-4 pl-3 text-gray-700", {
                            "font-bold text-gray-400": pathname == link.href,
                            "hover:text-blue-500 hover:underline duration-75":
                              pathname != link.href,
                          })}
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="block ml-3 sm:hidden">
                  <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <span className="sr-only">Open main menu</span>
                    {!isOpen ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
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
                    )}
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>
      ) : (
        <div className="flex flex-col fixed top-0 left-0 right-0 bg-white w-screen h-screen z-40">
          <div className="flex justify-end my-[10px] mx-[16px]">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
          <div className="flex flex-col flex-auto justify-center bg-white pb-20">
            <FadeIn>
              {links.map((link) => (
                <Link
                  onClick={() => setIsOpen((prev) => !prev)}
                  key={link.name}
                  href={
                    link.href +
                    (searchParams.get("clan-tag")?.toString() != undefined &&
                    searchParams.get("clan-tag")?.toString() != ""
                      ? "?clan-tag=" + searchParams.get("clan-tag")?.toString()
                      : "")
                  }
                  className={clsx(
                    "flex justify-center py-5 text-xl text-gray-700",
                    {
                      "font-bold text-gray-400": pathname == link.href,
                      "hover:text-blue-500 duration-75": pathname != link.href,
                    }
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </FadeIn>
          </div>
        </div>
      )}
    </>
  );
}
