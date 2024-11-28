import BasicTable from "./ui/table";
import { getDataFromServer } from "../lib/data";
import { Suspense } from "react";
import NestedPage from "./nested_page";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24">
      <Suspense>
        <NestedPage getData={getDataFromServer} />
      </Suspense>
    </main>
  );
}
