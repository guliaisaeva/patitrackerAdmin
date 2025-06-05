"use client";
import Form from "@/app/components/pets/petBreed/edit-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const [id, setId] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchId = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };

    fetchId();
  }, [params]);

  if (id === null) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("petBreed.petBreeds"), href: "/dashboard/pets/petBreed" },
          {
            label: t("petBreed.update"),
            href: `/dashboard/pets/petBreed/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form breedId={id} selectedPetType={""} />
    </main>
  );
}
