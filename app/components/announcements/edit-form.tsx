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
export default function UpdateAnnouncementForm({
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLocalizedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    languageId: number
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      announcementsLocalized: prevState.announcementsLocalized.map((item) =>
        item.languageId === languageId ? { ...item, [name]: value } : item
      ),
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const hasChanges =
      formState.title !== selectedAnnouncementDetail?.title ||
      formState.detail !== selectedAnnouncementDetail?.detail ||
      formState?.announcementsLocalized?.some((localization) => {
        const originalLocalization = selectedAnnouncementDetail?.languages.find(
          (lang) => lang.languageId === localization.languageId
        );
        return (
          originalLocalization &&
          (localization.title !== originalLocalization.title ||
            localization.detail !== originalLocalization.detail)
        );
      });

    if (!hasChanges) {
      alert(t("faq.messages.nothingToUpdate"));
      return;
    }

    const announcementsToSend: UpdateAnnouncement = {
      id: Number(formState.id),
      title: formState.title,
      detail: formState.detail,
      announcementsLocalized: formState.announcementsLocalized.map(
        (localization) => ({
          languageId: localization.languageId,
          title: localization.title,
          detail: localization.detail,
        })
      ),
    };

    try {
      const result = dispatch(updateAnnouncement(announcementsToSend)).unwrap();
      alert(t("announcement.messages.updateSuccess"));
      router.replace("/dashboard/announcements");
    } catch (error) {
      alert("announcement.messages.updateFailure");
      console.error("Update Announcement Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
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
            value={formState.title}
            onChange={handleChange}
            className=" text-gray-500 block w-full text-gray rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("announcement.form.enterTitleTr")}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="detail" className="mb-2 block text-sm font-medium">
            {t("announcement.form.detail")}
          </label>
          <textarea
            id="detail"
            name="detail"
            value={formState.detail}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("faq.form.enterDetail")}
            required
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
                value={localizedData.title || ""}
                onChange={(e) => handleLocalizedChange(e, lang.languageId)}
                className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                placeholder={t("faq.form.enterTitle")}
                required
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
                value={localizedData.detail || ""}
                onChange={(e) => handleLocalizedChange(e, lang.languageId)}
                className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                placeholder={t("faq.form.enterDetail")}
                required
              />
            </div>
          );
        })}

        {status === "failed" && error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/announcements"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t("cancel")}
          </Link>
          <Button type="submit" className="h-10">
            {t("update")}
          </Button>
        </div>
      </div>
    </form>
  );
}
