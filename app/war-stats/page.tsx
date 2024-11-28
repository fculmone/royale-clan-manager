import { Suspense } from "react";
import Header from "../ui/header";
import { getProbabilityDataFromServer } from "../lib/data";
import NestedPage from "./nested_page";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center px-24">
      <Suspense>
        <NestedPage getData={getProbabilityDataFromServer} />
      </Suspense>
    </main>
  );
}
