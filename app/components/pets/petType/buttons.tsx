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
  deletePetType,
  getAllPetTypes,
} from "@/lib/features/pet/petTypesSlice";
import { useTranslation } from "react-i18next";

export function CreatePetType() {
  const { t } = useTranslation();
  return (
    <Link
      href="/dashboard/pets/petType/create"
      className="flex h-10 items-center rounded-lg bg-orange-600 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      <span className="hidden md:block">{t("petType.create")}</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function PetTypeInfo({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/pets/petType/${id}/info`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <InformationCircleIcon className="w-5" />
    </Link>
  );
}

export function UpdatePetType({ id }: { id: number }) {
  return (
    <Link
      href={`/dashboard/pets/petType/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeletePetType({ id }: { id: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(deletePetType(id));
      dispatch(getAllPetTypes());
      alert(t("pet.type.messages.deleteSuccess"));
    } catch (error) {
      alert(t("pet.type.messages.deleteFailure"));

      console.error("Failed to delete invoice:", error);
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
