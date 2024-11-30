import { Suspense } from "react";
import Header from "../ui/header";
import ClanList from "./ui/clanList";

export default function NestedPage({ getData }: { getData: any }) {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="mt-12">
        <Suspense>
          <ClanList getData={getData} />
        </Suspense>
      </div>
    </div>
  );
}
