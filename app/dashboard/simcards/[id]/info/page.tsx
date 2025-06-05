"use client";
import Form from "@/app/components/simcards/infoPage";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page({ params }: { params: { id: number } }) {
  const id = params.id;
  const { t } = useTranslation();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("simCard.simCards"), href: "/dashboard/simcards" },
          {
            label: t("simCard.info"),
            href: `/dashboard/simcards/${id}/info`,
            active: true,
          },
        ]}
      />
      <Form simCardId={id} />
    </main>
  );
}
