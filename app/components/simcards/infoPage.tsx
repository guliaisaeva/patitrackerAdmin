"use client";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import {
  getSimDetailsAsync,
  selectSelectedSim,
} from "@/lib/features/sims/simsSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function SimCardInfoForm({ simCardId }: { simCardId: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const selectedSimcard = useSelector(selectSelectedSim);

  useEffect(() => {
    if ({ simCardId }) {
      dispatch(getSimDetailsAsync(simCardId));
    }
  }, [dispatch, simCardId]);

  if (!selectedSimcard) {
    return <div>{t("load")}</div>;
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const activityStatus = selectedSimcard.isActive;
  const activityClass = activityStatus
    ? "bg-green-100 text-green-600"
    : "bg-red-100 text-red-600";
  const activityText = activityStatus
    ? t("device.form.active")
    : t("device.form.notActive");
  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-medium"
          >
            {t("simCard.form.companyName")}{" "}
          </label>
          <div className="relative">
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={selectedSimcard?.companyName || ""}
              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="userName-error"
              readOnly
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="userName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="mb-2 block text-sm font-medium"
          >
            {t("simCard.form.phoneNumber")}{" "}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={selectedSimcard?.phoneNumber || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="fullName-error"
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="fullName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="apn" className="mb-2 block text-sm font-medium">
            {t("simCard.form.apn")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="apn"
                name="apn"
                type="text"
                value={selectedSimcard?.apn || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="fullName-error"
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="fullName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="dataSize" className="mb-2 block text-sm font-medium">
            {t("simCard.form.dataSize")}{" "}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="dataSize"
                name="dataSize"
                type="text"
                value={selectedSimcard?.dataSize || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="fullName-error"
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="fullName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="registerDate"
            className="mb-2 block text-sm font-medium"
          >
            {t("simCard.form.registerDate")}{" "}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="registerDate"
                name="registerDate"
                type="text"
                defaultValue={selectedSimcard?.registerDate || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div id="email-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="expirationDate"
            className="mb-2 block text-sm font-medium"
          >
            {t("simCard.form.expirationDate")}{" "}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="expirationDate"
                name="expirationDate"
                type="text"
                defaultValue={selectedSimcard.expirationDate}
                className="text-gray-500 *:peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="isActive" className="mb-2 block text-sm font-medium">
            {t("device.form.activityState")}{" "}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="isActive"
                name="isActive"
                type="text"
                defaultValue={activityText}
                className={`${activityClass} text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                aria-describedby="address-error"
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="address-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/simcards"
          className="flex h-10 items-center rounded-lg bg-green-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {t("close")}
        </Link>
        {/* <Button type="submit">Edit Device</Button> */}
      </div>
    </form>
  );
}
