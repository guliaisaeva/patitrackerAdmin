"use client";
import Form from "@/app/components/faqs/create-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("faq.faqs"), href: "/dashboard/faqs" },
          {
            label: t("faq.create"),
            href: "/dashboard/faqs/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
