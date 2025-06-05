"use client";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import {
  selectDeviceDetails,
  getDeviceDetailsAsync,
} from "@/lib/features/devices/devicesSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function DeviceInfoForm({ deviceId }: { deviceId: string }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const selectedDevice = useSelector(selectDeviceDetails);
  useEffect(() => {
    if ({ deviceId }) {
      dispatch(getDeviceDetailsAsync(deviceId));
    }
  }, [dispatch, deviceId]);

  if (!selectedDevice) {
    return <div>{t("load")}</div>;
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const activityStatus = selectedDevice.activityState;
  const activityClass = activityStatus
    ? "bg-green-100 text-green-600"
    : "bg-red-100 text-red-600";
  const activityText = activityStatus
    ? t("device.form.active")
    : t("device.form.notActive");
  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Display Profile Image */}
        <div className="mb-4 flex items-center justify-center">
          {selectedDevice?.userImageUrl ? (
            <div className="relative w-20 h-20 rounded-full  overflow-hidden">
              <Image
                src={selectedDevice.userImageUrl}
                layout="fill"
                width={28}
                height={28}
                alt={`${selectedDevice.userName}'s profile picture`}
              />
            </div>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
              <span className="text-gray-600 text-lg">
                {selectedDevice?.userName?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Display User Information */}
        <div className="mb-4">
          <label htmlFor="userName" className="mb-2 block text-sm font-medium">
            {t("device.form.userName")}
          </label>
          <div className="relative">
            <input
              id="userName"
              name="userName"
              type="text"
              value={selectedDevice?.userName || ""}
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
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            {t("device.form.userEmail")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="text"
                value={selectedDevice?.email || ""}
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
            htmlFor="memberShipStartDate"
            className="mb-2 block text-sm font-medium"
          >
            {t("device.form.memberShipStartDate")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="memberShipStartDate"
                name="memberShipStartDate"
                type="text"
                defaultValue={selectedDevice?.memberShipStartDate || ""}
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
            htmlFor="memberShipEndDate"
            className="mb-2 block text-sm font-medium"
          >
            {t("device.form.memberShipEndDate")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="memberShipEndDate"
                name="memberShipEndDate"
                type="text"
                defaultValue={selectedDevice?.memberShipEndDate || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="phoneNumber-error"
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="phoneNumber-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center">
          {selectedDevice?.userImageUrl ? (
            <div className="relative w-20 h-20 rounded-full  overflow-hidden">
              <Image
                src={selectedDevice.userImageUrl}
                layout="fill"
                width={28}
                height={28}
                alt={`${selectedDevice.userName}'s profile picture`}
              />
            </div>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
              <span className="text-gray-600 text-lg">
                {selectedDevice?.userName?.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="petName" className="mb-2 block text-sm font-medium">
            {t("device.form.petName")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="petName"
                name="petName"
                type="text"
                defaultValue={selectedDevice?.petName || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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

        <div className="mb-4">
          <label htmlFor="simNumber" className="mb-2 block text-sm font-medium">
            {t("device.form.simNumber")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="simNumber"
                name="simNumber"
                type="text"
                defaultValue={selectedDevice?.simNumber || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
        <div className="mb-4">
          <label htmlFor="deviceId" className="mb-2 block text-sm font-medium">
            {t("device.form.deviceId")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="deviceId"
                name="deviceId"
                type="text"
                defaultValue={selectedDevice?.deviceId || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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

        <div className="mb-4">
          <label
            htmlFor="activityState"
            className="mb-2 block text-sm font-medium"
          >
            {t("device.form.activityState")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="deviceId"
                name="deviceId"
                type="text"
                defaultValue={activityText}
                className={`${activityClass}text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
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
          href="/dashboard/devices"
          className="flex h-10 items-center rounded-lg bg-green-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {t("close")}{" "}
        </Link>
        {/* <Button type="submit">Edit Device</Button> */}
      </div>
    </form>
  );
}
