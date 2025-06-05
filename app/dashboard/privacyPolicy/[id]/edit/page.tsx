"use client";
import Breadcrumbs from "@/app/components/managers/breadcrumbs";
import { useTranslation } from "react-i18next";
import PrivacyPolicyTableEdit from "@/app/components/privacyPolicy/edit-form";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string; languageId: string }>();
  const { id, languageId } = params;
  const { t } = useTranslation();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t("privacy.privacy"), href: "/dashboard/privacyPolicy" },
          {
            label: t("privacy.update"),
            href: `/dashboard/privacyPolicy/${id}/edit`,
            active: true,
          },
        ]}
      />
      <PrivacyPolicyTableEdit />
    </main>
  );
}
