"use client";

import { PetsOutlined } from "@mui/icons-material";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useEffect, useState } from "react";
import {
  getPetDetail,
  selectLanguages,
  fetchLanguages,
  selectPetDetail,
  updatePetType,
  UpdatePetType,
} from "@/lib/features/pet/petTypesSlice";
import { Button } from "../../button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import trFlag from "@/public/images/turkey.png";
import ukFlag from "@/public/images/uk.png";

export default function EditPetsForm({ PetTypeId }: { PetTypeId: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const selectedPetTypeById = useSelector(selectPetDetail);
  const languages = useSelector(selectLanguages);

  // State for pet type details in both languages
  const [petTypeDataTr, setPetTypeDataTr] = useState<string>("");
  const [petTypeDataEn, setPetTypeDataEn] = useState<string>("");

  useEffect(() => {
    if (PetTypeId) {
      dispatch(getPetDetail(PetTypeId));
    }
  }, [dispatch, PetTypeId]);

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (selectedPetTypeById) {
      if (selectedPetTypeById.languageId === 1) {
        setPetTypeDataTr(selectedPetTypeById.typeName);
      } else if (selectedPetTypeById.languageId === 2) {
        setPetTypeDataEn(selectedPetTypeById.typeName);
      }
    }
  }, [selectedPetTypeById]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Prepare an array to hold update actions
      const updateActions: UpdatePetType[] = [];

      if (petTypeDataTr) {
        updateActions.push({
          petTypeId: PetTypeId,
          languageId: 1, // Turkish language ID
          petType: petTypeDataTr,
        });
      }
      if (petTypeDataEn) {
        updateActions.push({
          petTypeId: PetTypeId,
          languageId: 2, // English language ID
          petType: petTypeDataEn,
        });
      }

      // Dispatch all update actions
      updateActions.forEach((action) => dispatch(updatePetType(action)));

      alert(t("petType.messages.updateSuccess"));
      router.replace("/dashboard/pets/petType");
    } catch (error) {
      alert(t("petType.messages.updateFailure"));
      console.error("Update Pet Type Error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "petType_tr") {
      setPetTypeDataTr(value);
    } else if (name === "petType_en") {
      setPetTypeDataEn(value);
    }
  };

  if (!selectedPetTypeById) {
    return <div>{t("load")}</div>;
  }

  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label
            htmlFor="petType_tr"
            className="mb-2 flex flex-row items-center gap-3 text-sm font-medium"
          >
            <Image
              src={trFlag}
              alt="Turkish Flag"
              width={36}
              height={36}
              className="rounded-full"
            />
            {t("petType.form.petTypeTr")}{" "}
          </label>
          <div className="relative">
            <input
              id="petType_tr"
              name="petType_tr"
              type="text"
              value={petTypeDataTr}
              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="petType_tr-error"
              onChange={handleInputChange}
              placeholder={t("petType.form.enterPetTypeTr")}
            />
            <PetsOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="petType_tr-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="petType_en"
            className="mb-2 flex flex-row items-center gap-3 text-sm font-medium"
          >
            <Image
              src={ukFlag}
              alt="English Flag"
              width={36}
              height={36}
              className="rounded-full"
            />
            {t("petType.form.petTypeEn")}{" "}
          </label>
          <div className="relative">
            <input
              id="petType_en"
              name="petType_en"
              type="text"
              value={petTypeDataEn}
              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="petType_en-error"
              onChange={handleInputChange}
              placeholder={t("petType.form.enterPetTypeEn")}
            />
            <PetsOutlined className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="petType_en-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/pets/petType"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {t("cancel")}{" "}
        </Link>
        <Button type="submit">{t("update")}</Button>
      </div>
    </form>
  );
}
