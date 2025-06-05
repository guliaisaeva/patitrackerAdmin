"use client";
import {
  InformationCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { deleteDeviceAsync } from "@/lib/features/devices/devicesSlice";
import { useTranslation } from "react-i18next";

export function CreateDevice() {
  const { t } = useTranslation();
  return (
    <Link
      href="/dashboard/devices/create"
      className="flex h-10 items-center rounded-lg bg-orange-600 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      <span className="hidden md:block">{t("device.create")}</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export function DeviceInfo({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/devices/${id}/info`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <InformationCircleIcon className="w-5" />
    </Link>
  );
}

export function UpdateDevice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/devices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteDevice({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(deleteDeviceAsync(id));
      alert(t("device.messages.deleteSuccess"));
    } catch (error) {
      alert(t("device.messages.deleteFailure"));

      console.error("Failed to delete user:", error);
      // Handle errors, such as showing an error message to the user
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <button className="rounded-md border p-2 hover:bg-green-100  hover:text-black">
        <span className="sr-only">{t("delete")}</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
