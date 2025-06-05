"use client";

import { useEffect } from "react";
import {
  DeletePetType,
  PetTypeInfo,
  UpdatePetType,
} from "@/app/components/pets/petType/buttons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
  selectPetTypes,
  selectPetTypesStatus,
  selectPetTypesError,
  getAllPetTypes,
} from "@/lib/features/pet/petTypesSlice";
import NoResultsMessage from "@/app/components/noResultMessage";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export default function PetTypeTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const petTypes = useSelector(selectPetTypes);
  const status = useSelector(selectPetTypesStatus);
  const error = useSelector(selectPetTypesError);

  useEffect(() => {
    dispatch(getAllPetTypes());
  }, [dispatch]);

  const filteredPetTypes = petTypes?.filter((petType) =>
    petType.typeName.toLowerCase().includes(query.toLowerCase())
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const petTypesToShow = filteredPetTypes?.slice(startIndex, endIndex);

  // if (status === 'loading') {
  //   return <div>Loading PetTypes...</div>;
  // }

  if (status === "failed") {
    return (
      <div>
        {t("petType.errorLoadingPetType")}:{error}
      </div>
    );
  }
  if (!petTypesToShow || petTypesToShow?.length === 0) {
    return <NoResultsMessage />;
  }
  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {petTypesToShow.map((petType) => (
                <div
                  key={petType.typeId}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>{petType.typeName}</div>
                    <div className="flex justify-end gap-2">
                      <PetTypeInfo id={String(petType.typeId)} />
                      <UpdatePetType id={petType.typeId} />
                      <DeletePetType id={petType.typeId} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    İD
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    {t("petType.form.petTypeTr")}{" "}
                  </th>

                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {petTypesToShow?.map((petType) => (
                  <tr
                    key={petType.typeId}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="px-4 py-5 font-medium sm:pl-6">
                      {petType.typeId}
                    </td>

                    <td className="px-4 py-5 font-medium sm:pl-6">
                      {petType.typeName}
                    </td>

                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <PetTypeInfo id={String(petType.typeId)} />
                        <UpdatePetType id={petType.typeId} />
                        <DeletePetType id={petType.typeId} />
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
}
