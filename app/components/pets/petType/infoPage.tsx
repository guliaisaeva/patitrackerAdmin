"use client";
import { PetsOutlined, LanguageOutlined } from "@mui/icons-material";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useEffect } from "react";
import {
  getPetDetail,
  selectPetDetail,
} from "@/lib/features/pet/petTypesSlice";
import { useTranslation } from "react-i18next";

export default function PetTypeInfoForm({ PetTypeId }: { PetTypeId: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const selectedPetTypeById = useSelector(selectPetDetail);

  const languageText =
    selectedPetTypeById?.languageId === 1
      ? "Turkish"
      : selectedPetTypeById?.languageId === 2
      ? "English"
      : "";

  useEffect(() => {
    if ({ PetTypeId }) {
      dispatch(getPetDetail(PetTypeId));
    }
  }, [dispatch, PetTypeId]);

  if (!selectedPetTypeById) {
    return <div>{t("load")}</div>;
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="typeName" className="mb-2 block text-sm font-medium">
            {t("petType.form.petTypeTr")}{" "}
          </label>
          <div className="relative">
            <input
              id="typeName"
              name="typeName"
              type="text"
              value={selectedPetTypeById?.typeName || ""}
              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="userName-error"
              readOnly
            />
            <PetsOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="userName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="typeId" className="mb-2 block text-sm font-medium">
            {t("petType.form.typeId")}{" "}
          </label>
          <div className="relative">
            <input
              id="typeId"
              name="typeId"
              type="text"
              value={selectedPetTypeById?.typeId || ""}
              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="userName-error"
              readOnly
            />
            <PetsOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="userName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="languageId"
            className="mb-2 block text-sm font-medium"
          >
            {t("petType.form.language")}{" "}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="languageId"
                name="languageId"
                type="text"
                value={languageText}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="fullName-error"
                readOnly
              />
              <LanguageOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div id="fullName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/pets/petType"
          className="flex h-10 items-center rounded-lg bg-green-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {t("close")}{" "}
        </Link>
        {/* <Button type="submit">Edit Device</Button> */}
      </div>
    </form>
  );
}
