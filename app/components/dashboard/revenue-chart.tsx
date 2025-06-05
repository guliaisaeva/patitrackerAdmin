"use client";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/components/fonts";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export default function RevenueChart() {
  const { t } = useTranslation();

  const data = [
    { value: 5, label: "Mac" },
    { value: 15, label: "Windows" },
    { value: 15, label: "IOS" },
    { value: 20, label: "Android" },
  ];

  const size = {
    width: 400,
    height: 300,
  };
  const smallSize = {
    width: 300,
    height: 200,
  };

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontWeight: "bold",
    fontSize: 20,
  }));

  function PieCenterLabel({
    children,
    size,
  }: {
    children: React.ReactNode;
    size: { width: number; height: number };
  }) {
    const { width, height, left, top } = useDrawingArea();
    const fontSize = Math.min(size.width, size.height) / 10;

    return (
      <StyledText
        x={left + width / 2}
        y={top + height / 2}
        style={{ fontSize }}
      >
        {children}
      </StyledText>
    );
  }
  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {t("revenueChart.title")}
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mt-0 flex justify-center items-center rounded-md bg-white p-4 gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <PieChart
              series={[
                { data, innerRadius: 90, outerRadius: 120, paddingAngle: 5 },
              ]}
              {...size}
            >
              <PieCenterLabel size={size}>
                {t("revenueChart.total")}
              </PieCenterLabel>
            </PieChart>
          </div>
          <div className="block  sm:hidden">
            <PieChart
              series={[
                { data, innerRadius: 60, outerRadius: 70, paddingAngle: 5 },
              ]}
              {...smallSize}
            >
              <PieCenterLabel size={smallSize}>
                {t("revenueChart.total")}
              </PieCenterLabel>
            </PieChart>
          </div>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">
            {t("revenueChart.last12Months")}
          </h3>
        </div>
      </div>
    </div>
  );
}
