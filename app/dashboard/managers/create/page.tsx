
"use client";
import Form from '@/app/components/managers/create-form';
import Breadcrumbs from '@/app/components/managers/breadcrumbs';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
// import { fetchCustomers } from '@/app/lib/data';
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
          { label: t("manager.managers"), href: '/dashboard/managers' },
          {
            label: t('manager.create'),
            href: '/dashboard/managers/create',
            active: true,
          },
        ]}
      />
      <Form  />
    </main>
  );
}
