"use client";
import Form from "@/app/components/pets/petType/create-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("petType.petTypes"), href: "/dashboard/pets/petType" },
          {
            label: t("petType.create"),
            href: "/dashboard/pets/petType/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
