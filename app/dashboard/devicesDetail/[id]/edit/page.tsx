"use client"
import Form from "@/app/components/devices/edit-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
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
          { label: t("device.devices"), href: "/dashboard/devices" },
          {
            label: t("device.update"),
            href: `/dashboard/devices/${id}/edit`,
            // href: `#`,
            active: true,
          },
        ]}
      />
      <Form deviceId={id} />
    </main>
  );
}
