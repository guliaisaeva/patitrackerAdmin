"use client";

import { useEffect } from "react";
import DeviceStatus from "@/app/components/devices/status";
import { formatDateToLocal } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
  selectSims,
  selectSimsStatus,
  selectSimsError,
  getAllSimsAsync,
} from "@/lib/features/sims/simsSlice";
import { DeleteSimCard, SimCardInfo } from "@/app/components/simcards/buttons";
import NoResultsMessage from "../noResultMessage";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export default function SimCardTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const sims = useSelector(selectSims);
  const status = useSelector(selectSimsStatus);
  const error = useSelector(selectSimsError);

  useEffect(() => {
    dispatch(getAllSimsAsync());
  }, [dispatch]);

  const filteredSims = sims?.filter(
    (sim) =>
      sim.companyName.toLowerCase().includes(query.toLowerCase()) ||
      sim.apn.toLowerCase().includes(query.toLowerCase()) ||
      sim.dataSize.toLowerCase().includes(query.toLowerCase()) ||
      sim.phoneNumber.includes(query)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const simsToShow = filteredSims?.slice(startIndex, endIndex);

  // if (status === "loading") {
  //   return <div>{t("load")}</div>;
  // }

  if (status === "failed") {
    return (
      <div>
        {t("simCard.errorLoadingSimCard")}:{error}
      </div>
    );
  }

  if (!simsToShow || simsToShow?.length === 0) {
    return <NoResultsMessage />;
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {simsToShow?.map((sim: any) => (
              <div key={sim.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{sim.companyName}</p>
                    </div>
                    <p className="text-sm text-gray-500">{sim.deviceId}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{sim.phoneNumber} </p>
                    <p>{sim.dataSize}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <SimCardInfo id={String(sim.id)} />
                    <DeleteSimCard id={sim.id} />
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
                <th scope="col" className="px-3 py-5 font-medium">
                  {t("simCard.form.phoneNumber")}{" "}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {t("simCard.form.apn")}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {t("simCard.form.companyName")}{" "}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {t("simCard.form.registerDate")}{" "}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {t("simCard.form.expirationDate")}{" "}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {t("simCard.form.dataSize")}{" "}
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  {t("device.form.activityState")}{" "}
                </th>

                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {simsToShow?.map((sim) => (
                <tr
                  key={sim?.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{sim.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sim.phoneNumber}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">{sim.apn}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sim.companyName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(sim.registerDate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(sim.expirationDate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sim.dataSize}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <DeviceStatus statusType="active" status={sim.isActive} />
                  </td>

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <SimCardInfo id={String(sim.id)} />
                      <DeleteSimCard id={sim.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
