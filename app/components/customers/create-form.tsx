"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Image from "next/image";
import { AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { addAnnouncement } from "@/lib/features/announcement/announceSlice";
import {
  getUsersAsync,
  selectUserProfileId,
  selectUsersError,
  selectUsersStatus,
} from "@/lib/features/users/usersSlice";
import { useTranslation } from "react-i18next";
import trFlag from "@/public/images/turkey.png";
import ukFlag from "@/public/images/uk.png";
import Link from "next/link";

export default function Form() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);
  const userProfileId = useSelector(selectUserProfileId);

  const [trTitle, setTrTitle] = useState("");
  const [trDetail, setTrDetail] = useState("");
  const [enTitle, setEnTitle] = useState("");
  const [enDetail, setEnDetail] = useState("");
  const announcementTypeId = 1;
  const DEFAULT_USER_PROFILE_ID = 1;

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userProfileIds: number[] = Array.isArray(userProfileId)
      ? userProfileId.filter((id): id is number => id !== null) // Filter out null values
      : [userProfileId].filter((id): id is number => id !== null); // Handle single number

    if (userProfileIds.length === 0) {
      userProfileIds.push(DEFAULT_USER_PROFILE_ID);
    }

    const announcementsToSend = [];
    // Turkish Announcement
    if (trTitle || trDetail) {
      announcementsToSend.push({
        title: trTitle,
        detail: trDetail,
        announcementTypeId,
        mobileLanguageId: 1, // Turkish
        userProfileId: userProfileIds,
      });
    }

    // English Announcement
    if (enTitle || enDetail) {
      announcementsToSend.push({
        title: enTitle,
        detail: enDetail,
        announcementTypeId,
        mobileLanguageId: 2, // English
        userProfileId: userProfileIds,
      });
    }

    try {
      for (const announcement of announcementsToSend) {
        dispatch(addAnnouncement(announcement));
      }
      setTrTitle("");
      setTrDetail("");
      setEnTitle("");
      setEnDetail("");
      alert(t("user.messages.createSuccess"));
      router.replace("/dashboard/announcements");
    } catch (err) {
      console.error("Failed to add user:", err);
      alert(t("user.messages.createFailure"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Image
          src={trFlag}
          alt="Turkish Flag"
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            {t("announcement.form.title")}
          </label>
          <input
            id="trTitle"
            name="trTitle"
            value={trTitle}
            onChange={(e) => setTrTitle(e.target.value)}
            className=" text-gray-500 block w-full text-gray rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("announcement.form.enterTitleTr")}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="detail" className="mb-2 block text-sm font-medium">
            {t("announcement.form.detail")}
          </label>
          <textarea
            id="trDetail"
            name="trDetail"
            value={trDetail}
            onChange={(e) => setTrDetail(e.target.value)}
            className=" text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("announcement.form.enterTitleTr")}
          />
        </div>
        <Image
          src={ukFlag}
          alt="English Flag"
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            {t("announcement.form.title")}
          </label>
          <input
            id="enTitle"
            name="enTitle"
            value={enTitle}
            placeholder={t("announcement.form.enterTitleEn")}
            onChange={(e) => setEnTitle(e.target.value)}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="detail" className="mb-2 block text-sm font-medium">
            {t("announcement.form.detail")}
          </label>
          <textarea
            id="enDetail"
            name="enDetail"
            value={enDetail}
            onChange={(e) => setEnDetail(e.target.value)}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("announcement.form.enterDetailEn")}
          />
        </div>

        {status === "failed" && error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/customers"
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
              ? t("user.submit.creating")
              : t("user.submit.create")}
          </button>
        </div>
      </div>
    </form>
  );
}
