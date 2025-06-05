"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addPetType, fetchLanguages } from "@/lib/features/pet/petTypesSlice";
import Image from "next/image";
import { AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import trFlag from "@/public/images/turkey.png";
import ukFlag from "@/public/images/uk.png";
import Link from "next/link";

export default function Form() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [petTypeData, setPetTypeData] = useState({
    petType: "",
    languageId: 1, 
  });
  const [petTypeDataEn, setPetTypeDataEn] = useState({
    petType: "",
    languageId: 2,
  });

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      if (petTypeData.petType) {
        dispatch(addPetType(petTypeData));
      }
      if (petTypeDataEn.petType) {
        dispatch(addPetType(petTypeDataEn));
      }

      setPetTypeData({ petType: "", languageId: 1 });
      setPetTypeDataEn({ petType: "", languageId: 2 });
      alert(t("petType.messages.createSuccess"));
      router.replace("/dashboard/pets/petType");
    } catch (error) {
      console.error("Failed to add pet types:", error);
      alert(t("petType.messages.createFailure"));
    }
  };

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;

    if (name === "petType_tr") {
      setPetTypeData({ ...petTypeData, petType: value });
    } else if (name === "petType_en") {
      setPetTypeDataEn({ ...petTypeDataEn, petType: value });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
            {t("petType.form.newPetType")}{" "}
          </label>
          <input
            type="text"
            id="petType_tr"
            name="petType_tr"
            value={petTypeData.petType}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("petType.form.enterPetTypeTr")}
          />
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
            {t("petType.form.newPetType")}{" "}
          </label>
          <input
            type="text"
            id="petType_en"
            name="petType_en"
            value={petTypeDataEn.petType}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("petType.form.enterPetTypeEn")}
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/pets/petType"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t("cancel")}
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {t("petType.submit.create")}{" "}
          </button>
        </div>
      </div>
    </form>
  );
}
