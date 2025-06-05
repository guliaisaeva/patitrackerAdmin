"use client";

import Pagination from "@/app/components/managers/pagination";
import Search from "@/app/components/search";
import Table from "@/app/components/simcards/table";
import { CreateSimCard } from "@/app/components/simcards/buttons";
import { lusitana } from "@/app/components/fonts";
import { InvoicesTableSkeleton } from "@/app/components/skeletons";
import { Suspense, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";

import { getAllSimsAsync, selectSims } from "@/lib/features/sims/simsSlice";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

// export default function Page({
//   searchParams = {},
// }: {
//   searchParams?: {
//     query?: string;
//     page?: string;
//   };
// }) {
//   const { t } = useTranslation();
//   const dispatch = useDispatch<AppDispatch>();
//   const query = searchParams?.query || "";
//   const currentPage = Number(searchParams?.page) || 1;
//   const sims = useSelector(selectSims);
//   const totalSims = sims ? sims.length : 0;
//   const [filteredResultsCount, setFilteredResultsCount] = useState(0);

//   useEffect(() => {
//     dispatch(getAllSimsAsync());
//   }, [dispatch]);

//   useEffect(() => {
//     if (sims) {
//       const filteredSims = sims?.filter(
//         (sim) =>
//           sim.companyName.toLowerCase().includes(query.toLowerCase()) ||
//           sim.apn.toLowerCase().includes(query.toLowerCase()) ||
//           sim.dataSize.toLowerCase().includes(query.toLowerCase()) ||
//           sim.phoneNumber.includes(query)
//       ).length;
//       setFilteredResultsCount(filteredSims);
//     }
//   }, [sims, query]);

//   const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>
//           {t("simCard.simCards")}
//         </h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder={t("simCard.search.placeholder")} />
//         <CreateSimCard />
//       </div>
//       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
//         <Table query={query} currentPage={currentPage} />
//       </Suspense>
//       {filteredResultsCount > 0 && (
//         <div className="mt-5 flex w-full justify-center">
//           <Pagination totalPages={totalPages} />
//         </div>
//       )}
//     </div>
//   );
// }

import { useSearchParams } from "next/navigation"; // Import the correct hook

export default function Page() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // Use the useSearchParams hook to access query parameters
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || ""; // Use .get() to safely extract query param
  const currentPage = Number(searchParams.get("page")) || 1; // Same for page param

  const sims = useSelector(selectSims);
  const totalSims = sims ? sims.length : 0;
  const [filteredResultsCount, setFilteredResultsCount] = useState(0);

  useEffect(() => {
    dispatch(getAllSimsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (sims) {
      const filteredSims = sims.filter(
        (sim) =>
          sim.companyName.toLowerCase().includes(query.toLowerCase()) ||
          sim.apn.toLowerCase().includes(query.toLowerCase()) ||
          sim.dataSize.toLowerCase().includes(query.toLowerCase()) ||
          sim.phoneNumber.includes(query)
      ).length;
      setFilteredResultsCount(filteredSims);
    }
  }, [sims, query]);

  const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {t("simCard.simCards")}
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t("simCard.search.placeholder")} />
        <CreateSimCard />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      {filteredResultsCount > 0 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
