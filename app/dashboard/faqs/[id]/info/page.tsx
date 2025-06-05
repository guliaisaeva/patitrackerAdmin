"use client";
import Form from "@/app/components/faqs/infoPage";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page({ params }: { params: { id: number } }) {
  const id = params.id;
  const { t } = useTranslation();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("faq.faqs"), href: "/dashboard/faqs" },
          {
            label: t("faq.info"),
            href: `/dashboard/faqs/${id}/info`,
            active: true,
          },
        ]}
      />
      <Form questionId={id} languageId={1} />
    </main>
  );
}
