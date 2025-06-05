"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import NoResultsMessage from "../noResultMessage";
import {
  getAllAnnouncement,
  selectAnnouncementError,
  selectAnnouncements,
  selectAnnouncementStatus,
} from "@/lib/features/announcement/announceSlice";
import AnnouncementStatus from "./status";
import {
  AnnouncementInfo,
  DeleteAnnouncement,
  UpdateAnnouncement,
} from "./buttons";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export default function AnnouncementTable({
  query,
  currentPage,
  filteredResultsCount,
}: {
  query: string;
  currentPage: number;
  filteredResultsCount: number;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const announcements = useSelector(selectAnnouncements);
  const status = useSelector(selectAnnouncementStatus);
  const error = useSelector(selectAnnouncementError);

  useEffect(() => {
    dispatch(getAllAnnouncement());
  }, [dispatch]);

  const filteredAnnouncement = announcements?.filter(
    (announcements) =>
      announcements?.title?.toLowerCase().includes(query.toLowerCase()) ||
      announcements?.detail?.toLowerCase().includes(query.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const announcementToShow = filteredAnnouncement?.slice(startIndex, endIndex);

  // if (status === "loading") {
  //   return <div>Loading devices...</div>;
  // }

  if (status === "failed") {
    return (
      <div>
        {t("announcement.errorLoadingAnnouncement")}: {error}
      </div>
    );
  }

  if (!announcementToShow || announcementToShow?.length === 0) {
    return <NoResultsMessage />;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {announcementToShow?.map((announcement: any) => (
                <div
                  key={announcement.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{announcement.title}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {announcement.detail}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <AnnouncementStatus
                      statusType="read"
                      status={announcement.isRead}
                    />
                    <div className="flex justify-end gap-2">
                      <AnnouncementInfo id={String(announcement.id)} />
                      <UpdateAnnouncement id={String(announcement.id)} />
                      <DeleteAnnouncement id={announcement.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    İD
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("announcement.form.title")}{" "}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("announcement.form.detail")}{" "}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("announcement.status.status")}{" "}
                  </th>

                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">{t("edit")}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {announcementToShow?.map((announcement) => (
                  <tr
                    key={announcement.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{announcement.id}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {announcement.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {announcement.detail}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <AnnouncementStatus
                        statusType="read"
                        status={announcement.isRead}
                      />
                    </td>

                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <AnnouncementInfo id={String(announcement.id)} />
                        <UpdateAnnouncement id={String(announcement.id)} />
                        <DeleteAnnouncement id={announcement.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
