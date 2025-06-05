"use client";
import Form from "@/app/components/announcements/edit-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const [id, setId] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchId = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id); 
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };

    fetchId();
  }, [params]);

  if (id === null) {
    return <div>Loading...</div>;
  }


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: t("announcement.announcements"),
            href: "/dashboard/announcements",
          },
          {
            label: t("announcement.update"),
            href: `/dashboard/announcements/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form announcementId={id} languageId={1} />
    </main>
  );
}
