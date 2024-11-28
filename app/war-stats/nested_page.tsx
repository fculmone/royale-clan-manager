import { Suspense } from "react";
import Header from "../ui/header";
import WarStats from "./ui/warStats";

export default function NestedPage({ getData }: { getData: any }) {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <div className="mt-12">
        <Suspense>
          <WarStats getData={getData} />
        </Suspense>
      </div>
    </div>
  );
}
