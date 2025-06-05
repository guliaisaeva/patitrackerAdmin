"use client";
import Form from "@/app/components/customers/infoPage";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const { t } = useTranslation();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("user.users"), href: "/dashboard/customers" },
          {
            label: t("user.info"),
            href: `/dashboard/customers/${id}/info`,
            active: true,
          },
        ]}
      />
      <Form userId={parseInt(id)} />
    </main>
  );
}
