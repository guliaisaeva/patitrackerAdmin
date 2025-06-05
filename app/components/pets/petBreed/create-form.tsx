"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addPetBreed, getAllPetBreeds } from "@/lib/features/pet/petBreedSlice";
import { AppDispatch } from "@/lib/store";
import { getAllPetTypes } from "@/lib/features/pet/petTypesSlice";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  fetchLanguages,
  selectLanguages,
} from "@/lib/features/languages/languagesSlice";
interface FormProps {
  selectedPetType: string;
}
export default function Form({ selectedPetType }: FormProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const languages = useSelector(selectLanguages);

  const [formData, setFormData] = useState<{
    petTypeId: number;
    breedName: string;
    averageStepLength: number;
    petBreedsLocalized: { languageId: number; breedName: string }[];
  }>({
    petTypeId: Number(selectedPetType),
    breedName: "",
    averageStepLength: 0,
    petBreedsLocalized: [],
  });

  useEffect(() => {
    dispatch(getAllPetTypes());
    dispatch(fetchLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (selectedPetType === "1") {
      dispatch(
        getAllPetBreeds({
          petTypeId: selectedPetType,
          languageId: 1 | 2,
        })
      );
    }
  }, [dispatch, selectedPetType]);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   if (name === "breedName_tr") {
  //     setPetBreedData((prevData) => ({
  //       ...prevData,
  //       breedName: value,
  //     }));
  //   } else if (name === "breedName_en") {
  //     setPetBreedDataEn((prevData) => ({
  //       ...prevData,
  //       breedName: value,
  //     }));
  //   }
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setPetBreedData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     if (petBreedData.breedName && selectedPetType) {
  //       dispatch(
  //         addPetBreed({
  //           petTypeId: Number(selectedPetType),
  //           languageId: petBreedData.languageId,
  //           breedName: petBreedData.breedName,
  //         })
  //       );
  //     }

  //     if (petBreedDataEn.breedName && selectedPetType) {
  //       dispatch(
  //         addPetBreed({
  //           petTypeId: Number(selectedPetType),
  //           languageId: petBreedDataEn.languageId,
  //           breedName: petBreedDataEn.breedName,
  //         })
  //       );
  //     }

  //     setPetBreedData({
  //       breedName: "",
  //       languageId: 1,
  //     });
  //     setPetBreedDataEn({
  //       breedName: "",
  //       languageId: 2,
  //     });

  //     alert(t("petBreed.messages.createSuccess"));
  //     router.replace(
  //       `/dashboard/pets/petBreed?selectedPetType=${selectedPetType}`
  //     );
  //   } catch (err) {
  //     console.error("Failed to add pet breeds:", err);
  //     alert(t("petBreed.messages.createFailure"));
  //   }
  // };

  useEffect(() => {
    if (languages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        petBreedsLocalized: languages.map((lang) => ({
          languageId: lang.languageId,
          breedName:
            prev.petBreedsLocalized.find(
              (item) => item.languageId === lang.languageId
            )?.breedName || "",
        })),
      }));
    }
  }, [languages]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;

  //   if (name === "breedName") {
  //     setFormData((prev) => ({
  //       ...prev,
  //       breedName: value,
  //     }));
  //   } else if (name.startsWith("breedName_")) {
  //     const languageId = parseInt(name.split("_")[1], 10);
  //     setFormData((prev) => ({
  //       ...prev,
  //       petBreedsLocalized: prev.petBreedsLocalized.map((localized) =>
  //         localized.languageId === languageId
  //           ? { ...localized, breedName: value }
  //           : localized
  //       ),
  //     }));
  //   }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handling breedName for the default (non-localized)
    if (name === "breedName") {
      setFormData((prev) => ({
        ...prev,
        breedName: value,
      }));
    }

    // Handling averageStepLength
    else if (name === "averageStepLength") {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setFormData((prev) => ({
          ...prev,
          averageStepLength: numericValue,
        }));
      }
    }

    // Handling breedName for localized languages
    else if (name.startsWith("breedName_")) {
      const languageId = parseInt(name.split("_")[1], 10);
      setFormData((prev) => ({
        ...prev,
        petBreedsLocalized: prev.petBreedsLocalized.map((localized) =>
          localized.languageId === languageId
            ? { ...localized, breedName: value }
            : localized
        ),
      }));
    }
  };
  interface FormErrors {
    breedName?: string;
    averageStepLength?: number;
  }
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    let isValid = true;

    if (!formData.breedName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        breedName: t("petBreed.messages.breedNameRequired"),
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        breedName: "",
      }));
    }

    return isValid;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);
    if (!validateForm()) {
      return;
    }
    const newPetBreed = {
      petTypeId: formData.petTypeId,
      breedName: formData.breedName,
      averageStepLength: formData.averageStepLength,
      petBreedsLocalized: formData.petBreedsLocalized,
    };

    try {
      await dispatch(addPetBreed(newPetBreed)).unwrap();

      setFormData({
        petTypeId: 0,
        breedName: "",
        averageStepLength: 0,
        petBreedsLocalized: languages.map((lang) => ({
          languageId: lang.languageId,
          breedName: "",
        })),
      });

      alert(t("petBreed.messages.createSuccess"));
      router.replace(
        `/dashboard/pets/petBreed?selectedPetType=${selectedPetType}`
      );
    } catch (err) {
      console.error("Failed to add pet breeds:", err);
      alert(t("petBreed.messages.createFailure"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <div>
            <label
              htmlFor="breedName"
              className="mb-2 flex flex-row items-center gap-3 text-sm font-medium justify-between"
            >
              {t("petBreed.form.newPetType")}
            </label>
            <input
              type="text"
              id="breedName"
              name="breedName"
              value={formData.breedName}
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t("petBreed.form.enterPetType")}
              required
            />
            {errors.breedName && (
              <p className="text-red-500 text-sm mt-1">{errors.breedName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="averageStepLength"
              className="mb-2 flex flex-row items-center gap-3 text-sm font-medium justify-between"
            >
              {t("petBreed.form.averageStepLength")}
            </label>
            <input
              type="number"
              id="averageStepLength"
              name="averageStepLength"
              value={formData.averageStepLength}
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t("petBreed.form.enterPetType")}
              required
            />
            {errors.averageStepLength && (
              <p className="text-red-500 text-sm mt-1">
                {errors.averageStepLength}
              </p>
            )}
          </div>
        </div>

        {languages.map((lang) => (
          <div key={lang.languageId} className="mb-4">
            <label
              htmlFor={`breedName_${lang.languageId}`}
              className="mb-2 flex flex-row items-center gap-3 text-sm font-medium justify-between"
            >
              {t("petBreed.form.newPetType")}
              <p>
                {lang.languageAbbreviation}/{lang.languageName}
              </p>
            </label>
            <input
              type="text"
              id={`breedName_${lang.languageId}`}
              name={`breedName_${lang.languageId}`}
              value={
                formData.petBreedsLocalized.find(
                  (item) => item.languageId === lang.languageId
                )?.breedName || ""
              }
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t(
                `petBreed.form.enterPetType${
                  lang.languageId === 1 ? "Tr" : "En"
                }`
              )}
            />
          </div>
        ))}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/pets/petBreed"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t("cancel")}
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {t("petBreed.submit.create")}{" "}
          </button>
        </div>
      </div>
    </form>
  );
}
