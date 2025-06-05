"use client";
import RevenueChart from "@/app/components/dashboard/revenue-chart";
import LineChart from "@/app/components/dashboard/lineCharts";
import { lusitana } from "@/app/components/fonts";
import { Suspense } from "react";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/components/skeletons";
import CardWrapper from "@/app/components/dashboard/cards";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {t("dashboard")}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {" "}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LineChart />
        </Suspense>
      </div>
    </main>
  );
}
