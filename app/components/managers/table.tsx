"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  UpdateManager,
  DeleteManager,
  InfoManagers,
} from "@/app/components/managers/buttons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
  selectManagers,
  selectManagersStatus,
  selectManagersError,
  getManagersAsync,
} from "@/lib/features/managers/managersSlice";
import NoResultsMessage from "../noResultMessage";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export default function ManagersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const managers = useSelector(selectManagers);
  const status = useSelector(selectManagersStatus);
  const error = useSelector(selectManagersError);

  useEffect(() => {
    dispatch(getManagersAsync());
  }, [dispatch]);

  const filteredManagers = managers?.filter(
    (manager) =>
      manager.fullName.toLowerCase().includes(query.toLowerCase()) ||
      manager.userName.toLowerCase().includes(query.toLowerCase()) ||
      manager.email.toLowerCase().includes(query.toLowerCase()) ||
      manager.address.toLowerCase().includes(query.toLowerCase())
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const managersToShow = filteredManagers?.slice(startIndex, endIndex);

  // if (status === "loading") {
  //   return <div>{t("load")}</div>;
  // }

  if (status === "failed") {
    return <div>Error loading managers:{error}</div>;
  }
  if (!managersToShow || managersToShow?.length === 0) {
    return <NoResultsMessage />;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {managersToShow?.map((manager: any) => (
                <div
                  key={manager.userProfileId}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <div className="flex items-center gap-3">
                          {manager.profileImageUrl ? (
                            <Image
                              src={manager.profileImageUrl}
                              className="mr-2 rounded-full"
                              width={28}
                              height={28}
                              alt={`${manager.fullName}'s profile picture`}
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <div className="mr-2 rounded-full w-7 h-7 flex items-center justify-center bg-gray-300 text-gray-600">
                              {manager.fullName.charAt(0)}
                            </div>
                          )}
                          <p>{manager.userName}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{manager.email}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>{manager.phoneNumber}</div>

                    <div className="flex justify-end gap-2">
                      <InfoManagers id={String(manager.userProfileId)} />
                      <UpdateManager id={String(manager.userProfileId)} />
                      <DeleteManager id={String(manager.userProfileId)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    {t("manager.form.manager.name")}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("manager.form.manager.last.name")}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("manager.form.manager.email")}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("manager.form.manager.phone.number")}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("manager.form.manager.address.information")}
                  </th>

                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {managersToShow?.map((manager) => (
                  <tr
                    key={manager.userProfileId}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        {manager.profileImageUrl ? (
                          <Image
                            src={manager.profileImageUrl}
                            className=" rounded-full"
                            width={28}
                            height={28}
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                            }}
                            alt={`${manager.fullName}'s profile picture`}
                          />
                        ) : (
                          <div className="mr-2 rounded-full w-7 h-7 flex items-center justify-center bg-gray-300 text-gray-600">
                            {manager.fullName.charAt(0)}
                          </div>
                        )}
                        <p>{manager.userName}</p>{" "}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {manager.fullName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {manager.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {manager.phoneNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {manager.address}
                    </td>

                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <InfoManagers id={String(manager.userProfileId)} />
                        <UpdateManager id={String(manager.userProfileId)} />
                        <DeleteManager id={String(manager.userProfileId)} />
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
