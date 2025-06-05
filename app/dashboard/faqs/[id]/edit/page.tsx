"use client";

import Form from "@/app/components/faqs/edit-form";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
          { label: t("faq.faqs"), href: "/dashboard/faqs" },
          {
            label: t("faq.update"),
            href: `/dashboard/faqs/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form questionId={id} languageId={0} />
    </main>
  );
}
