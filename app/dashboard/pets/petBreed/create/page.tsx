"use client";
import Form from "@/app/components/pets/petBreed/create-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const selectedPetType = searchParams.get("selectedPetType") || "";

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("petBreed.petBreeds"), href: "/dashboard/pets/petBreed" },
          {
            label: t("petBreed.create"),
            href: "/dashboard/pets/petBreed/create",
            active: true,
          },
        ]}
      />
      <Form selectedPetType={selectedPetType} />
    </main>
  );
}
