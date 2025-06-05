"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCountryPhoneCode,
  addSimCardAsync,
  AddSimCard,
  GetAllPhoneCodeAsync,
} from "@/lib/features/sims/simsSlice";
import { AppDispatch } from "@/lib/store";
import {
  getDevicesForConnectSimAsync,
  selectDevicesError,
  selectDevicesStatus,
  selectDevicesWithSim,
} from "@/lib/features/devices/devicesSlice";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";

const dataSizeList = [
  { id: 0, value: "100 MB" },
  { id: 1, value: "200 MB" },
  { id: 2, value: "500 MB" },
  { id: 3, value: "1 GB" },
  { id: 4, value: "5 GB" },
  { id: 5, value: "10 GB" },
  { id: 6, value: "20 GB" },
];

export default function Form() {
  const { t } = useTranslation();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectDevicesStatus);
  const error = useSelector(selectDevicesError);
  const CountryPhoneCodes = useSelector(selectCountryPhoneCode);
  const devicesWithSim = useSelector(selectDevicesWithSim);
  const [phoneError, setPhoneError] = useState("");
  const [dateError, setDateError] = useState("");

  const [simData, setSimData] = useState<AddSimCard>({
    countryPhoneCodeId: 0,
    companyName: "",
    phoneNumber: "",
    apn: "",
    dataSize: "",
    registerDate: "",
    expirationDate: "",
    isSimToDevice: false,
    deviceId: 0,
  });

  useEffect(() => {
    dispatch(getDevicesForConnectSimAsync());
    dispatch(GetAllPhoneCodeAsync());
  }, [dispatch]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (new Date(simData.expirationDate) < new Date(simData.registerDate)) {
      setDateError(t("simCard.form.errors.expirationDate"));
      return;
    }

    try {
      const dataToSend = {
        ...simData,
        dataSize: simData.dataSize.toString(),
      };

      dispatch(addSimCardAsync(dataToSend));
      setSimData({
        countryPhoneCodeId: 0,
        companyName: "",
        phoneNumber: "",
        apn: "",
        dataSize: "",
        registerDate: "",
        expirationDate: "",
        isSimToDevice: false,
        deviceId: 0,
      });
      alert(t("simCard.messages.createSuccess"));
      router.replace("/dashboard/simcards");
    } catch (err) {
      console.error("Failed to add simCard:", err);
      alert(t("simCard.messages.createFailure"));
    }
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type, checked } = event.target;
  //   setSimData((prevData) => ({
  //     ...prevData,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    if (name === "phoneNumber") {
      // Allow only digits and limit to 10 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setSimData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));

      // Clear error message if valid
      if (numericValue.length === 10) {
        setPhoneError("");
      } else {
        setPhoneError(t("simCard.form.placeholders.phoneNumber"));
      }
    } else {
      setSimData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSimData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSimData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (
      name === "expirationDate" &&
      new Date(value) < new Date(simData.registerDate)
    ) {
      setDateError(t("simCard.form.expirationDateValid"));
    } else {
      setDateError("");
    }
  };
  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4 md:flex md:space-x-4">
          <div className="mb-4 md:mb-0 md:flex-1">
            <label
              htmlFor="companyName"
              className="mb-2 block text-sm font-medium"
            >
              {t("simCard.form.companyName")}{" "}
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={simData.companyName}
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t("simCard.form.placeholders.companyName")}
              required
            />
          </div>

          <div className="md:flex-1">
            <label htmlFor="apn" className="mb-2 block text-sm font-medium">
              {t("simCard.form.apn")}
            </label>
            <input
              id="apn"
              name="apn"
              type="text"
              value={simData.apn}
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t("simCard.form.placeholders.apn")}
              required
            />
          </div>
        </div>

        <div className="mb-4 md:flex md:items-center md:space-x-4">
          <div className="mb-4 md:mb-0 md:w-1/3">
            <label
              htmlFor="countryPhoneCodeId"
              className="mb-2 block text-sm font-medium"
            >
              {t("simCard.form.phoneNumber")}{" "}
            </label>
            <select
              id="countryPhoneCodeId"
              name="countryPhoneCodeId"
              value={simData.countryPhoneCodeId}
              onChange={handleSelectChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            >
              <option value="">
                {" "}
                {t("simCard.form.placeholders.countryPhoneCodeId")}
              </option>
              {CountryPhoneCodes?.map((countryCode) => (
                <option
                  key={countryCode?.countryPhoneId}
                  value={countryCode.countryPhoneId}
                >
                  {countryCode.phoneCode}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-2/3">
            <label
              htmlFor="phoneNumber"
              className="mb-2 block text-sm font-medium"
            >
              {t("simCard.form.phoneNumber")}{" "}
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={simData.phoneNumber}
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t("simCard.form.placeholders.phoneNumber")}
              required
            />
            {phoneError && (
              <div className="mt-1 text-green-500 text-sm">{phoneError}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="dataSize" className="mb-2 block text-sm font-medium">
            {t("simCard.form.dataSize")}{" "}
          </label>
          <select
            id="dataSize"
            name="dataSize"
            value={simData.dataSize}
            onChange={handleSelectChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          >
            <option value="">{t("simCard.form.placeholders.dataSize")}</option>
            {dataSizeList?.map((dataSize) => (
              <option key={dataSize?.id} value={dataSize.id}>
                {dataSize.value}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 md:flex md:space-x-4">
          <div className="mb-4 md:mb-0 md:flex-1">
            <label
              htmlFor="registerDate"
              className="mb-2 block text-sm font-medium"
            >
              {t("simCard.form.registerDate")}{" "}
            </label>
            <input
              type="date"
              name="registerDate"
              id="registerDate"
              value={simData.registerDate}
              onChange={handleDateChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />
          </div>

          <div className="md:flex-1">
            <label
              htmlFor="expirationDate"
              className="mb-2 block text-sm font-medium"
            >
              {t("simCard.form.expirationDate")}{" "}
            </label>
            <input
              type="date"
              name="expirationDate"
              id="expirationDate"
              value={simData.expirationDate}
              onChange={handleDateChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              required
            />

            {dateError && (
              <div className="mt-1 text-green-500 text-sm">{dateError}</div>
            )}
          </div>
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className=" mb-4 md:mb-0 md:w-1/4 flex items-center ">
            <input
              type="checkbox"
              id="isSimToDevice"
              name="isSimToDevice"
              checked={simData.isSimToDevice}
              onChange={handleChange}
              className="h-5 w-5 cursor-pointer border-gray-300 bg-gray-100 text-green-500 focus:ring-2  focus:ring-green-500"
            />
            <label
              htmlFor="isSimToDevice"
              className="ml-2 cursor-pointer text-sm"
            >
              {t("simCard.form.isSimToDevice")}{" "}
            </label>
          </div>

          {simData.isSimToDevice && (
            <div className="md:w-3/4">
              <label
                htmlFor="simCardId"
                className="mb-2 block text-sm font-medium"
              >
                {t("simCard.form.deviceId")}{" "}
              </label>
              <select
                id="deviceId"
                name="deviceId"
                value={simData.deviceId}
                onChange={handleSelectChange}
                className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              >
                <option value="">
                  {t("simCard.form.placeholders.deviceId")}
                </option>
                {devicesWithSim?.map((device) => (
                  <option key={device?.deviceId} value={device?.deviceId}>
                    {device.deviceNumber}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {status === "failed" && error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/simcards"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t("cancel")}
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={status === "loading"}
          >
            {status === t("load")
              ? t("simCard.submit.creating")
              : t("simCard.submit.create")}
          </button>
        </div>
      </div>
    </form>
  );
}
