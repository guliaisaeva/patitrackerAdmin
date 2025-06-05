"use client";
import Pagination from "@/app/components/managers/pagination";
import Search from "@/app/components/search";
import Table from "@/app/components/devices/table";
import { CreateDevice } from "@/app/components/devices/buttons";
import { lusitana } from "@/app/components/fonts";
import { InvoicesTableSkeleton } from "@/app/components/skeletons";
import { Suspense, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
  selectDevices,
  getDevicesAsync,
} from "@/lib/features/devices/devicesSlice";
import { useTranslation } from "react-i18next";
import React from "react";

const ITEMS_PER_PAGE = 10;

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // const query = searchParams?.query || "";
  // const currentPage = Number(searchParams?.page) || 1;


  const devices = useSelector(selectDevices);
  const totalDevices = devices ? devices.length : 0;
  const [filteredResultsCount, setFilteredResultsCount] = useState(0);

  useEffect(() => {
    dispatch(getDevicesAsync());
  }, [dispatch]);

  const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {t("device.detail")}
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t("device.search.placeholder")} />
        <CreateDevice />
      </div>
   
      {filteredResultsCount > 0 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

// "use client";

// import Pagination from "@/app/components/managers/pagination";
// import Search from "@/app/components/search";
// import Table from "@/app/components/announcements/table";
// import { lusitana } from "@/app/components/fonts";
// import { InvoicesTableSkeleton } from "@/app/components/skeletons";
// import { Suspense, useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatch } from "@/lib/store";
// import { CreateAnnouncement } from "@/app/components/announcements/buttons";
// import {
//   getAllAnnouncement,
//   selectAnnouncements,
// } from "@/lib/features/announcement/announceSlice";
// import { useTranslation } from "react-i18next";
// import { useSearchParams } from "next/navigation";

// const ITEMS_PER_PAGE = 10;

// export default function Page() {
//   const { t } = useTranslation();
//   const dispatch = useDispatch<AppDispatch>();
//   const searchParams = useSearchParams(); // Get the search params using the hook

//   // Unwrap the values properly using .get()
//   const query = searchParams.get("query") || ""; // Use .get() to extract the query param
//   const currentPage = Number(searchParams.get("page")) || 1; // Use .get() for page as well

//   const announcements = useSelector(selectAnnouncements);
//   const [filteredResultsCount, setFilteredResultsCount] = useState(0);

//   useEffect(() => {
//     dispatch(getAllAnnouncement()); // Dispatch an action to get all announcements
//   }, [dispatch]);

//   useEffect(() => {
//     if (announcements) {
//       const filteredCount = announcements.filter(
//         (announcement) =>
//           announcement?.title?.toLowerCase().includes(query.toLowerCase()) ||
//           announcement?.detail?.toLowerCase().includes(query.toLowerCase())
//       ).length;
//       setFilteredResultsCount(filteredCount); // Set the filtered results count
//     }
//   }, [announcements, query]);

//   const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE); // Calculate total pages for pagination

//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>
//           {t("announcement.announcements")}
//         </h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder={t("announcement.search.placeholder")} />
//         <CreateAnnouncement />
//       </div>
//       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
//         <Table
//           query={query}
//           currentPage={currentPage}
//           filteredResultsCount={filteredResultsCount}
//         />
//       </Suspense>
//       {filteredResultsCount > 0 && (
//         <div className="mt-5 flex w-full justify-center">
//           <Pagination totalPages={totalPages} />
//         </div>
//       )}
//     </div>
//   );
// }
