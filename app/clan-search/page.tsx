import { Suspense } from "react";
import Header from "../ui/header";
import { getClanList } from "../lib/data";
import NestedPage from "./nested_page";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center px-24 pb-4">
      <Suspense>
        <NestedPage getData={getClanList} />
      </Suspense>
    </main>
  );
}
