"use client";
import { lusitana } from "@/app/components/fonts";
import { useTranslation } from "react-i18next";
import LanguageTabs from "@/app/components/languageTabs";
import TermsOfUseTable from "@/app/components/termsOfUse/table";
import { useEffect, useState } from "react";

export default function Page({ languageId }: { languageId: number }) {
  const { t } = useTranslation();
  const mongoDbUri = process.env.MONGODB_URI;   const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch(`/api/getMongoData`);
        const data = await res.json();
        setDevices(data);
      } catch (err) {
        console.error('Failed to fetch devices:', err);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, []);
  const renderContent = (languageId: number) => {
    return <TermsOfUseTable languageId={languageId} />;
  };
  return (
    <>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>
            {t("terms.termsOfUse")}
          </h1>
          <div>
      <h1>Data from MongoDB</h1>
      <ul>
        {devices.map((device: any) => (
          <li key={device._id}>{device.name}</li>
        ))}
      </ul>
    </div>
        </div>
        <div className="flex mt-6 gap-4">
          <LanguageTabs
            selectedLanguageId={languageId}
            renderContent={renderContent}
          />
        </div>
      </div>
    </>
  );
}
