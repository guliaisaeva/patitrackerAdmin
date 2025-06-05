// "use client";

// import Pagination from "@/app/components/managers/pagination";
// import Search from "@/app/components/search";
// import Table from "@/app/components/managers/table";
// import { CreateManager } from "@/app/components/managers/buttons";
// import { lusitana } from "@/app/components/fonts";
// import { InvoicesTableSkeleton } from "@/app/components/skeletons";
// import { Suspense, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { selectManagers } from "@/lib/features/managers/managersSlice";
// import { useTranslation } from "react-i18next";

// const ITEMS_PER_PAGE = 10;

// export default function Page({
//   searchParams,
// }: {
//   searchParams?: {
//     query?: string;
//     page?: string;
//   };
// }) {
//   const { t } = useTranslation();
//   const query = searchParams?.query || "";
//   const currentPage = Number(searchParams?.page) || 1;
//   const managers = useSelector(selectManagers);
//   const [filteredResultsCount, setFilteredResultsCount] = useState(0);
//   useEffect(() => {
//     if (managers) {
//       const filteredManagers = managers?.filter(
//         (manager) =>
//           manager.fullName.toLowerCase().includes(query.toLowerCase()) ||
//           manager.userName.toLowerCase().includes(query.toLowerCase()) ||
//           manager.email.toLowerCase().includes(query.toLowerCase()) ||
//           manager.address.toLowerCase().includes(query.toLowerCase())
//       ).length;
//       setFilteredResultsCount(filteredManagers);
//     }
//   }, [managers, query]);

//   const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);
//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>
//           {t("manager.managers")}
//         </h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder={t("manager.search.placeholder")} />
//         <CreateManager />
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

"use client";

import Pagination from "@/app/components/managers/pagination";
import Search from "@/app/components/search";
import Table from "@/app/components/managers/table";
import { CreateManager } from "@/app/components/managers/buttons";
import { lusitana } from "@/app/components/fonts";
import { InvoicesTableSkeleton } from "@/app/components/skeletons";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectManagers } from "@/lib/features/managers/managersSlice";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation"; 

const ITEMS_PER_PAGE = 10;

export default function Page() {
  const { t } = useTranslation();
  const searchParams = useSearchParams(); 

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const managers = useSelector(selectManagers);
  const [filteredResultsCount, setFilteredResultsCount] = useState(0);

  useEffect(() => {
    if (managers) {
      const filteredManagers = managers?.filter(
        (manager) =>
          manager.fullName.toLowerCase().includes(query.toLowerCase()) ||
          manager.userName.toLowerCase().includes(query.toLowerCase()) ||
          manager.email.toLowerCase().includes(query.toLowerCase()) ||
          manager.address.toLowerCase().includes(query.toLowerCase())
      ).length;
      setFilteredResultsCount(filteredManagers);
    }
  }, [managers, query]);

  const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {t("manager.managers")}
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t("manager.search.placeholder")} />
        <CreateManager />
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
