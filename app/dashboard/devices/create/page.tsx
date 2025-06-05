"use client";
import Form from "@/app/components/devices/create-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("device.devices"), href: "/dashboard/devices" },
          {
            label: t("device.create"),
            href: "/dashboard/devices/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
