"use client";
import Form from "@/app/components/simcards/create-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("simCard.simCards"), href: "/dashboard/simcards" },
          {
            label: t("simCard.create"),
            href: "/dashboard/simcards/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
