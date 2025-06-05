// "use client";
// import Pagination from "@/app/components/managers/pagination";
// import Search from "@/app/components/search";
// import Table from "@/app/components/customers/table";
// import { lusitana } from "@/app/components/fonts";
// import { InvoicesTableSkeleton } from "@/app/components/skeletons";
// import { Suspense, useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatch } from "@/lib/store";
// import { getUsersAsync, selectUsers } from "@/lib/features/users/usersSlice";
// import { CreateUser } from "@/app/components/customers/buttons";
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
//   const dispatch = useDispatch<AppDispatch>();
//   const query = searchParams?.query || "";
//   const currentPage = Number(searchParams?.page) || 1;
//   const users = useSelector(selectUsers);
//   const [filteredResultsCount, setFilteredResultsCount] = useState(0);

//   useEffect(() => {
//     dispatch(getUsersAsync());
//   }, [dispatch]);

//   useEffect(() => {
//     if (users) {
//       const filteredUsers = users.filter(
//         (user) =>
//           user.userName.toLowerCase().includes(query.toLowerCase()) ||
//           user.fullName.toLowerCase().includes(query.toLowerCase()) ||
//           user.email.toLowerCase().includes(query.toLowerCase()) ||
//           user.address.toLowerCase().includes(query.toLowerCase())
//       ).length;
//       setFilteredResultsCount(filteredUsers);
//     }
//   }, [users, query]);
//   const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>{t("user.users")}</h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder={t("user.search.placeholder")} />
//         <CreateUser />
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
import Table from "@/app/components/customers/table";
import { lusitana } from "@/app/components/fonts";
import { InvoicesTableSkeleton } from "@/app/components/skeletons";
import { Suspense, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { getUsersAsync, selectUsers } from "@/lib/features/users/usersSlice";
import { CreateUser } from "@/app/components/customers/buttons";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation"; // Import the hook to access search parameters

const ITEMS_PER_PAGE = 10;

export default function Page() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams(); // Use the hook to get search params

  // Use .get() to safely access query and page parameters
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const users = useSelector(selectUsers);
  const [filteredResultsCount, setFilteredResultsCount] = useState(0);

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      const filteredUsers = users.filter(
        (user) =>
          user.userName.toLowerCase().includes(query.toLowerCase()) ||
          user.fullName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.address.toLowerCase().includes(query.toLowerCase())
      ).length;
      setFilteredResultsCount(filteredUsers);
    }
  }, [users, query]);

  const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{t("user.users")}</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t("user.search.placeholder")} />
        <CreateUser />
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
