"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  addAnnouncement,
  selectAnnouncementError,
  selectAnnouncementStatus,
} from "@/lib/features/announcement/announceSlice";
import {
  getUsersAsync,
  selectUserProfileId,
} from "@/lib/features/users/usersSlice";
import Link from "next/link";
import {
  fetchLanguages,
  selectLanguages,
} from "@/lib/features/languages/languagesSlice";
import { useTranslation } from "react-i18next";

export default function Form() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const status = useSelector(selectAnnouncementStatus);
  const error = useSelector(selectAnnouncementError);
  const languages = useSelector(selectLanguages);
  const userProfileId = useSelector(selectUserProfileId);

  const announcementTypeId = 1;
  const DEFAULT_USER_PROFILE_ID = 1;

  const [formData, setFormData] = useState<{
    title: string;
    detail: string;
    announcementTypeId: number;
    userProfileId: number[];
    announcementsLocalized: {
      languageId: number;
      title: string;
      detail: string;
    }[];
  }>({
    title: "",
    detail: "",
    announcementTypeId: 1,
    userProfileId: [0],
    announcementsLocalized: [],
  });

  useEffect(() => {
    dispatch(getUsersAsync());
    dispatch(fetchLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (languages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        announcementsLocalized: languages.map((lang) => ({
          languageId: lang.languageId,
          title: "",
          detail: "",
        })),
      }));
    }
  }, [languages]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Check if the change is for the main announcement title or detail
    if (name === "title" || name === "detail") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // For localized titles or details
    else if (
      name.startsWith("announcement_") ||
      name.startsWith("announcementDetail_")
    ) {
      const [field, languageIdStr] = name.split("_");
      const languageId = parseInt(languageIdStr, 10);
      const fieldName = field === "announcement" ? "title" : "detail";
      setFormData((prev) => ({
        ...prev,
        announcementsLocalized: prev.announcementsLocalized.map((item) =>
          item.languageId === languageId
            ? { ...item, [fieldName]: value }
            : item
        ),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const announcementData = {
      title: formData.title,
      detail: formData.detail,
      announcementTypeId: formData.announcementTypeId,
      userProfileId:
        formData.userProfileId.length > 0 ? formData.userProfileId : [1],
      announcementsLocalized: formData.announcementsLocalized.map(
        (localized) => ({
          languageId: localized.languageId,
          title: localized.title,
          detail: localized.detail,
        })
      ),
    };

    try {
      await dispatch(addAnnouncement(announcementData)).unwrap();

      setFormData({
        title: "",
        detail: "",
        announcementTypeId: 1,
        userProfileId: [1],
        announcementsLocalized: languages.map((lang) => ({
          languageId: lang.languageId,
          title: "",
          detail: "",
        })),
      });

      alert(t("announcement.messages.createSuccess"));
      router.replace("/dashboard/announcements");
    } catch (err) {
      console.error("Failed to add announcement:", err);
      alert(t("announcement.messages.createFailure"));
    }
  };
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
            value={formData.title}
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
            value={formData.detail}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("faq.form.enterDetail")}
            required
          />
        </div>
        {languages.map((lang) => (
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
              name={`announcement_${lang.languageId}`}
              value={
                formData.announcementsLocalized.find(
                  (q) => q.languageId === lang.languageId
                )?.title || ""
              }
              onChange={handleChange}
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
              name={`announcementDetail_${lang.languageId}`}
              value={
                formData.announcementsLocalized.find(
                  (q) => q.languageId === lang.languageId
                )?.detail || ""
              }
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t("faq.form.enterDetail")}
              required
            />
          </div>
        ))}

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
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? t("announcement.submit.creating")
              : t("announcement.submit.create")}
          </button>
        </div>
      </div>
    </form>
  );
}
