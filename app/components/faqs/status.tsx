"use client";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface StatusProps {
  statusType: "read" | "notRead";
  status: boolean;
}

export default function QuestionStatus({ statusType, status }: StatusProps) {
  const { t } = useTranslation();
  const statusText = (type: "read" | "notRead", status: boolean) => {
    switch (type) {
      case "read":
        return status ? t("faq.status.read") : t("faq.status.notRead");
      case "notRead":
        return status ? t("faq.status.notRead") : t("faq.status.read");
      default:
        return "";
    }
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-gray-100 text-gray-500": !status,
          "bg-green-500 text-white": status,
        }
      )}
    >
      {statusText(statusType, status)}
      {status ? (
        <CheckIcon className="ml-1 w-4 text-white" />
      ) : (
        <ClockIcon className="ml-1 w-4 text-gray-500" />
      )}
    </span>
  );
}
