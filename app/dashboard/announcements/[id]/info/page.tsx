"use client";
import Form from "@/app/components/announcements/infoPage";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page({ params }: { params: { id: number } }) {
  const id = params.id;
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
            label: t("announcement.info"),
            href: `/dashboard/announcements/${id}/info`,
            active: true,
          },
        ]}
      />
      <Form announcementId={id} />
    </main>
  );
}
