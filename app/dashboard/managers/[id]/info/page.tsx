"use client";
import Form from "@/app/components/managers/infoPage";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";
// import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const { t } = useTranslation();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("manager.managers"), href: "/dashboard/managers" },
          {
            label: t("manager.info"),
            href: `/dashboard/managers/${id}/info`,
            active: true,
          },
        ]}
      />
      <Form managerId={id} />
    </main>
  );
}
