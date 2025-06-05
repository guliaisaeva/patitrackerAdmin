"use client";
import Form from "@/app/components/pets/petBreed/infoPage";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";

export default function Page({ params }: { params: { id: number } }) {
  const id = params.id;
  const { t } = useTranslation();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("petBreed.petBreeds"), href: "/dashboard/pets/petBreed" },
          {
            label: t("petBreed.info"),
            href: `/dashboard/pets/petBreed/${id}/info`,
            active: true,
          },
        ]}
      />
      <Form breedId={id} selectedPetType={""} />
    </main>
  );
}
