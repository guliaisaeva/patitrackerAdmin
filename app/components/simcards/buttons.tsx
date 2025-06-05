"use client";
import {
  InformationCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
  deleteSimCardAsync,
  getAllSimsAsync,
} from "@/lib/features/sims/simsSlice";
import { useTranslation } from "react-i18next";

export function CreateSimCard() {
  const { t } = useTranslation();
  return (
    <Link
      href="/dashboard/simcards/create"
      className="flex h-10 items-center rounded-lg bg-orange-600 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      <span className="hidden md:block">{t("simCard.create")}</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export function SimCardInfo({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/simcards/${id}/info`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <InformationCircleIcon className="w-5" />
    </Link>
  );
}

export function UpdateSimCard({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/simcards/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteSimCard({ id }: { id: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(deleteSimCardAsync(id));
      dispatch(getAllSimsAsync());

      alert(t("simCard.messages.deleteSuccess"));
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      alert(t("simCard.messages.deleteFailure"));
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
