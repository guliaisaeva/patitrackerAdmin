// "use client";

// import Pagination from "@/app/components/managers/pagination";
// import Search from "@/app/components/search";
// import Table from "@/app/components/faqs/table";
// import { lusitana } from "@/app/components/fonts";
// import { InvoicesTableSkeleton } from "@/app/components/skeletons";
// import { Suspense, useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatch } from "@/lib/store";
// import { getAllQuestions, selectQuestions } from "@/lib/features/faq/faqSlice";
// import { CreateQuestion } from "@/app/components/faqs/buttons";
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
//   const questions = useSelector(selectQuestions);
//   const [filteredResultsCount, setFilteredResultsCount] = useState(0);

//   useEffect(() => {
//     dispatch(getAllQuestions());
//   }, [dispatch]);

//   useEffect(() => {
//     if (questions) {
//       const filteredAnnouncement = questions?.filter(
//         (question) =>
//           question?.title?.toLowerCase().includes(query.toLowerCase()) ||
//           question?.detail?.toLowerCase().includes(query.toLowerCase())
//       ).length;
//       setFilteredResultsCount(filteredAnnouncement);
//     }
//   }, [questions, query]);

//   const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

//   return (
//     <div className="w-full">
//       <div className="flex w-full items-center justify-between">
//         <h1 className={`${lusitana.className} text-2xl`}>{t("faq.faqs")}</h1>
//       </div>
//       <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//         <Search placeholder={t("faq.search.placeholder")} />
//         <CreateQuestion />
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
import Table from "@/app/components/faqs/table";
import { lusitana } from "@/app/components/fonts";
import { InvoicesTableSkeleton } from "@/app/components/skeletons";
import { Suspense, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { getAllQuestions, selectQuestions } from "@/lib/features/faq/faqSlice";
import { CreateQuestion } from "@/app/components/faqs/buttons";
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

  const questions = useSelector(selectQuestions);
  const [filteredResultsCount, setFilteredResultsCount] = useState(0);

  useEffect(() => {
    dispatch(getAllQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (questions) {
      const filteredAnnouncement = questions.filter(
        (question) =>
          question?.title?.toLowerCase().includes(query.toLowerCase()) ||
          question?.detail?.toLowerCase().includes(query.toLowerCase())
      ).length;
      setFilteredResultsCount(filteredAnnouncement);
    }
  }, [questions, query]);

  const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{t("faq.faqs")}</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t("faq.search.placeholder")} />
        <CreateQuestion />
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
