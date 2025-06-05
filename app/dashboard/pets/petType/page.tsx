"use client";

import Pagination from "@/app/components/managers/pagination";
import Search from "@/app/components/search";
import Table from "@/app/components/pets/petType/table";
import { CreatePetType } from "@/app/components/pets/petType/buttons";
import { lusitana } from "@/app/components/fonts";
import { InvoicesTableSkeleton } from "@/app/components/skeletons";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectPetTypes } from "@/lib/features/pet/petTypesSlice";
import { useTranslation } from "react-i18next";
const ITEMS_PER_PAGE = 10;
export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const { t } = useTranslation();
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const petTypes = useSelector(selectPetTypes);
  const totalPetTypes = petTypes ? petTypes.length : 0;
  const [filteredResultsCount, setFilteredResultsCount] = useState(0);

  useEffect(() => {
    if (petTypes) {
      const filteredPetTypes = petTypes?.filter((petType) =>
        petType.typeName.toLowerCase().includes(query.toLowerCase())
      ).length;
      setFilteredResultsCount(filteredPetTypes);
    }
  }, [petTypes, query]);

  const totalPages = Math.ceil(filteredResultsCount / ITEMS_PER_PAGE);

  return (
    <>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>
            {t("petType.petTypes")}
          </h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder={t("petType.search.placeholder")} />
          <CreatePetType />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <Table query={query} currentPage={currentPage} />
        </Suspense>

        {filteredResultsCount > 0 && (
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </div>
    </>
  );
}
