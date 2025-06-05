"use client";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";
import TermsOfUseTableInfo from "@/app/components/termsOfUse/edit-form";
import TermsOfUseTableEdit from "@/app/components/termsOfUse/edit-form";
import { useSelector } from "react-redux";
import { useState } from 'react';
import { useParams } from "next/navigation";



export default function Page() {
  const params = useParams<{ id: string; languageId: string }>();
  const { id, languageId } = params;
  const { t } = useTranslation();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("terms.termsOfUse"), href: "/dashboard/termsOfUse" },
          {
            label: t("terms.update"),
            href: `/dashboard/termsOfUse/${id}/edit`,
            active: true,
          },
        ]}
      />
      <TermsOfUseTableEdit />
    </main>
  );
}
