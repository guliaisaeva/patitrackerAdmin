"use client";
import Form from "@/app/components/pets/petType/infoPage";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page({ params }: { params: { id: number } }) {
  const id = params.id;
  const { t } = useTranslation();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("petType.petTypes"), href: "/dashboard/pets/petType" },
          {
            label: t("petType.info"),
            href: `/dashboard/pets/petType/${id}/info`,
            active: true,
          },
        ]}
      />
      <Form PetTypeId={id} />
    </main>
  );
}
