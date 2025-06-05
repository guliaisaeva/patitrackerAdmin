"use client";
import Form from "@/app/components/announcements/create-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: t("announcement.announcements"),
            href: "/dashboard/announcements",
          },
          {
            label: t("announcement.create"),
            href: "/dashboard/announcements/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
