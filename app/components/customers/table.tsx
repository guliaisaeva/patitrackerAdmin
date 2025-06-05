"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
  getUsersAsync,
  selectUsers,
  selectUsersStatus,
  selectUsersError,
} from "@/lib/features/users/usersSlice";
import { UserInfo } from "./buttons";
import NoResultsMessage from "../noResultMessage";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

interface CustomerTableProps {
  query: string;
  currentPage: number;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  query,
  currentPage,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);

  const filteredUsers = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(query.toLowerCase()) ||
      user.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.address.toLowerCase().includes(query.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const usersToShow = filteredUsers?.slice(startIndex, endIndex);

  // if (status === "loading") {
  //   return <div>Loading managers...</div>; // Show loading indicator while fetching users
  // }

  if (status === "failed") {
    return <div>Error loading managers: {error}</div>; // Show error message if user fetching fails
  }

  if (!usersToShow || usersToShow.length === 0) {
    return <NoResultsMessage />;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {usersToShow.map((user) => (
                <div
                  key={user.userProfileId}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <div className="flex items-center gap-3">
                          {user.profileImageUrl ? (
                            <Image
                              src={user.profileImageUrl}
                              className="mr-2 rounded-full"
                              width={28}
                              height={28}
                              alt={`${user.fullName}'s profile picture`}
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <div className="mr-2 rounded-full w-7 h-7 flex items-center justify-center bg-gray-300 text-gray-600">
                              {user.fullName.charAt(0)}
                            </div>
                          )}
                          <p>{user.userName}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{user.fullName}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between border-b py-5">
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">{t("user.email")}</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">{t("user.phoneNumber")}</p>
                      <p className="font-medium">{user.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="pt-4 text-sm">{user.address}</div>
                  <div className="flex justify-between gap-3">
                    <UserInfo id={String(user.userProfileId)} />
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    {t("user.userName")}{" "}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("user.fullName")}{" "}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("user.email")}{" "}
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    {t("user.phoneNumber")}
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    {t("user.address")}
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    {t("detail")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-900">
                {usersToShow.map((user) => (
                  <tr key={user.userProfileId} className="group">
                    <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                      <div className="flex items-center gap-3">
                        {user.profileImageUrl ? (
                          <Image
                            src={user.profileImageUrl}
                            className="mr-2 rounded-full"
                            width={28}
                            height={28}
                            alt={`${user.fullName}'s profile picture`}
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <div className="mr-2 rounded-full w-7 h-7 flex items-center justify-center bg-gray-300 text-gray-600">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                        <p>{user.userName}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {user.fullName}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {user.phoneNumber}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                      {user.address}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                      <div className="flex justify-end gap-3">
                        <UserInfo id={String(user.userProfileId)} />
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
};

export default CustomerTable;
