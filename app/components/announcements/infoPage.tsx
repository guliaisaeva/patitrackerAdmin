"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import {
  getAnnouncementDetail,
  selectAnnouncementDetail,
  UpdateAnnouncement,
  updateAnnouncement,
} from "@/lib/features/announcement/announceSlice";
import Link from "next/link";
import { Button } from "../button";
import { useTranslation } from "react-i18next";

import {
  fetchLanguages,
  selectLanguages,
} from "@/lib/features/languages/languagesSlice";

interface AnnouncementsLocalized {
  languageId: number;
  title: string;
  detail: string;
}

interface FormState {
  id: number | null;
  title: string;
  detail: string;
  announcementsLocalized: AnnouncementsLocalized[];
}

export default function AnnouncementInfoForm({
  announcementId,
  languageId,
}: {
  announcementId: number;
  languageId: number;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const selectedAnnouncementDetail = useSelector(selectAnnouncementDetail);
  const languages = useSelector(selectLanguages);
  const { id } = useParams();

  const [formState, setFormState] = useState<FormState>({
    id: 0,
    title: "",
    detail: "",
    announcementsLocalized: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (announcementId !== null) {
      dispatch(getAnnouncementDetail({ announcementId, languageId }));
    }
    dispatch(fetchLanguages());
  }, [dispatch, announcementId, languageId]);

  useEffect(() => {
    if (selectedAnnouncementDetail) {
      setFormState({
        id: Number(id),
        title: selectedAnnouncementDetail.title || "",
        detail: selectedAnnouncementDetail.detail || "",
        announcementsLocalized:
          selectedAnnouncementDetail?.languages?.map((lang) => ({
            languageId: lang.languageId,
            title: lang.title || "",
            detail: lang.detail || "",
          })) || [],
      });
    }
  }, [selectedAnnouncementDetail]);

  return (
    <form className="my-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label
            htmlFor="title"
            className="mb-2  text-sm font-medium flex justify-between"
          >
            {t("announcement.form.title")}
          </label>
          <input
            id="title"
            name="title"
            defaultValue={formState.title}
            className=" text-gray-500 block w-full text-gray rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("announcement.form.enterTitleTr")}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="detail" className="mb-2 block text-sm font-medium">
            {t("announcement.form.detail")}
          </label>
          <textarea
            id="detail"
            name="detail"
            defaultValue={formState.detail}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("faq.form.enterDetail")}
            readOnly
          />
        </div>
        {languages.map((lang) => {
          const localizedData = formState.announcementsLocalized.find(
            (item) => item.languageId === lang.languageId
          ) || { title: "", detail: "" };

          return (
            <div key={lang.languageId} className="mb-4 mt-4">
              <label
                htmlFor={`announcement_${lang.languageId}`}
                className="mb-2 mt-2 flex justify-between  text-sm font-medium"
              >
                <p> {t("announcement.form.title")}</p>
                {`${lang.languageAbbreviation}/ ${lang.languageName} `}
              </label>
              <input
                type="text"
                id={`announcement_${lang.languageId}`}
                name="title"
                defaultValue={localizedData.title || ""}
                className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                placeholder={t("faq.form.enterTitle")}
                readOnly
              />

              <label
                htmlFor={`announcementDetail_${lang.languageId}`}
                className="mb-2 mt-2 flex justify-between  text-sm font-medium"
              >
                <p> {t("announcement.form.detail")}</p>
                {`${lang.languageAbbreviation}/${lang.languageName} `}
              </label>
              <textarea
                id={`announcementDetail_${lang.languageId}`}
                name="detail"
                defaultValue={localizedData.detail || ""}
                className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                placeholder={t("faq.form.enterDetail")}
                readOnly
              />
            </div>
          );
        })}
        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/announcements"
            className="flex h-10 items-center rounded-lg bg-green-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t("close")}
          </Link>
          {/* <Button type="submit">Edit Device</Button> */}
        </div>
      </div>
    </form>
  );
}
