import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function StatsSkeleton() {
  //flex flex-1 overflow-x-auto shadow-md sm:rounded-l xl:w-[1200px] lg:w-[1000px] w-screen
  return (
    <>
      <SkeletonTheme baseColor="#DCDCDC" highlightColor="#999999">
        <div className="text-center">
          <Skeleton className="mt-12 max-w-[300px]" height={40} />
        </div>
      </SkeletonTheme>
      <div className="h-screen w-screen max-w-[400px] max-x-[400px] lg:max-h-[700px] lg:max-w-[700px] aspect-square px-2  xl:px-8 items-center justify-center text-center mb-32">
        <SkeletonTheme baseColor="#DCDCDC" highlightColor="#999999">
          <Skeleton className="aspect-square mt-14 " />
        </SkeletonTheme>
      </div>
    </>
  );
}
