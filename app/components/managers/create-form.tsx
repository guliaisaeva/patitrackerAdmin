"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDeviceAsync } from "@/lib/features/devices/devicesSlice";
import { AppDispatch } from "@/lib/store";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { addManagerAsync, getAllCitiesAsync, getAllDistrictsAsync, getAllPhoneCodesAsync, getManagerByIdAsync, selectCities, selectDistricts, selectManagerById, selectPhoneCodes } from "@/lib/features/managers/managersSlice";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../button";
import { useRouter } from "next/navigation";


interface RegisterAdmin {
  firstName: string;
  lastName: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
  isExternalRegister: boolean;
  cityId: string;
  cityName: string;
  districtId: string;
  districtName: string;
  adresDescription: string;
  direction: string;
  zipCode: string;
  countryPhoneCodeId: number;
  phoneCode: string;
  phoneNumber: string;
}

export default function Form() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [userData, setUserData] = useState<RegisterAdmin>({
    firstName: "",
    lastName: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    isExternalRegister: true,
    cityId: "",
    cityName: "",
    districtId: "",
    districtName: "",
    adresDescription: "",
    direction: "",
    zipCode: "",
    countryPhoneCodeId: 0,
    phoneCode: "",
    phoneNumber: "",
  });

  const selectedManagerById = useSelector(selectManagerById);
  const cities = useSelector(selectCities);
  const districts = useSelector(selectDistricts);
  const phoneCodes = useSelector(selectPhoneCodes);


  const [selectedCityId, setSelectedCityId] = useState<any | null>(
    selectedManagerById?.userAddress?.cityId || null
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<any | null>(
    selectedManagerById?.userAddress?.districtId || null
  );

  useEffect(() => {
    dispatch(getAllCitiesAsync());
    dispatch(getAllPhoneCodesAsync())
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllDistrictsAsync(selectedCityId));
  }, [dispatch, selectedCityId]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const completeData: RegisterAdmin = {
  //     ...userData,
  //     cityId: selectedCityId?.toString() || "",
  //     districtId: selectedDistrictId?.toString() || "",
  //     countryPhoneCodeId: Number(userData.countryPhoneCodeId),

  //   };
  //   dispatch(addManagerAsync(completeData));
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const completeData: RegisterAdmin = {
      ...userData,
      cityId: selectedCityId?.toString() || "",
      districtId: selectedDistrictId?.toString() || "",
      cityName: cities.find(city => city.cityId === selectedCityId)?.cityName || "",
      districtName: districts.find(district => district.districtId === selectedDistrictId)?.districtName || "",
      countryPhoneCodeId: Number(userData.countryPhoneCodeId),
    };

    try {
      const resultAction = await dispatch(addManagerAsync(completeData));

      if (addManagerAsync.fulfilled.match(resultAction)) {
        alert(t("manager.messages.createSuccess"));
        router.replace("/dashboard/managers");
      } else {
        console.error("Manager creation failed:", resultAction);
        alert(t("manager.messages.createError") || "An error occurred.");
      }
    } catch (error) {
      console.error("Error adding manager:", error);
      alert(t("manager.messages.createError") || "An error occurred.");
    }
  };
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = parseInt(e.target.value);
    setSelectedCityId(cityId);
    setSelectedDistrictId(null);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = parseInt(e.target.value);
    setSelectedDistrictId(districtId);
  };

  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* <div className="mb-4 flex items-center justify-center">
          {selectedManagerById?.profileImageUrl ? (
            <div className="relative w-20 h-20 rounded-full  overflow-hidden">
              <Image
                src={selectedManagerById.profileImageUrl}
                width={38}
                height={38}
                alt={`${selectedManagerById.firstName}'s profile picture`}
                style={{ width: "38px", height: "38px", borderRadius: "50%" }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
              <span className="text-gray-600 text-lg">
                {selectedManagerById?.firstName?.charAt(0)}
              </span>
            </div>
          )}
        </div> */}
        <div className="mb-4">
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
            {t("manager.form.manager.name")}
          </label>
          <div className="relative">
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={userData?.firstName || ""}
              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="firstName-error"
              onChange={handleChange}
            />
          </div>
          <div id="firstName-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
            {t("manager.form.manager.last.name")}
          </label>
          <div className="relative">
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={userData?.lastName || ""}
              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="lastName-error"
              onChange={handleChange}
            />
          </div>
          <div id="lastName-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            {t("manager.form.manager.email")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="text"
                value={userData?.email || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
                onChange={handleChange}
              />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium"
          >
            {t("manager.form.manager.password")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type="text"
                value={userData?.newPassword || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="newPassword-error"
                onChange={handleChange}

              />
            </div>
          </div>
          <div id="newPassword-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium"
          >
            {t("manager.form.manager.passwordConfirm")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="text"
                value={userData?.confirmPassword || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="confirmPassword-error"
                onChange={handleChange}

              />
            </div>
          </div>
          <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>

        <div className="mb-4">

          <div className="relative mt-2 rounded-md flex gap-2 ">

            {/* <div className="relative"> */}
            <input
              type="checkbox"
              name="isExternalRegister"
              checked={userData.isExternalRegister}
              onChange={(e) =>
                setUserData(prev => ({
                  ...prev,
                  isExternalRegister: e.target.checked,
                }))
              }
            />
            {/* </div> */}
            <label
              htmlFor="isExternalRegister"
              className="mb-2 block text-sm font-medium"
            >
              {t("manager.form.isExternalRegister")}
            </label>
          </div>
          <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>


        <label
          htmlFor="userAddress"
          className="mb-2 block text-sm font-medium justify-center"
        >
          {t("manager.form.manager.address.information")}
        </label>

        <div className="mb-4">
          <label htmlFor="cityId" className="mb-2 block text-sm font-medium">
            {t("manager.form.city")}
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="cityId"
              name="cityId"
              value={selectedCityId || ""}
              onChange={handleCityChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            >
              <option value=""> {t("manager.form.select.city")}</option>
              {cities?.map((city) => (
                <option key={city?.cityId} value={city?.cityId}>
                  {city.cityName}
                </option>
              ))}
            </select>
          </div>
          <div id="cityName-error" aria-live="polite" aria-atomic="true">
          </div>
          <label
            htmlFor="districtId"
            className="mb-2 block text-sm font-medium"
          >
            {t("manager.form.district")}
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="districtId"
              name="districtId"
              value={selectedDistrictId || ""}
              onChange={handleDistrictChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            >
              <option value=""> {t("manager.form.select.district")}</option>
              {districts?.map((district) => (
                <option key={district?.districtId} value={district?.districtId}>
                  {district.districtName}
                </option>
              ))}
            </select>
          </div>
          <div id="districtName-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="zipCode"
            className="mb-2 block text-sm font-medium"
          >
            {t("manager.form.zipCode")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={userData?.zipCode || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="zipCode-error"
                onChange={handleChange}


              />
            </div>
          </div>
          <div id="zipCode-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="adresDescription"
            className="mb-2 block text-sm font-medium"
          >
            {t("manager.form.adresDescription")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="adresDescription"
                name="adresDescription"
                type="text"
                value={userData?.adresDescription || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="adresDescription-error"
                onChange={handleChange}


              />
            </div>
          </div>
          <div id="adresDescription-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="direction"
            className="mb-2 block text-sm font-medium"
          >
            {t("manager.form.direction")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="direction"
                name="direction"
                type="text"
                value={userData?.direction || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="direction-error"
                onChange={handleChange}

              />
            </div>
          </div>
          <div id="direction-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="countryPhoneCodeId" className="mb-2 block text-sm font-medium">
            {t("manager.form.phoneCountryCode")}
          </label>
          <div className="relative mt-2 rounded-md">
            <select
              id="countryPhoneCodeId"
              name="countryPhoneCodeId"
              value={userData.countryPhoneCodeId}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                const selectedCode = phoneCodes.find(code => code.countryPhoneId === selectedId)?.phoneCode || "";
                setUserData(prev => ({
                  ...prev,
                  countryPhoneCodeId: selectedId,
                  phoneCode: selectedCode,
                }));
              }}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            >
              <option value="">{t("manager.form.phoneCountryCodeSelect")}</option>
              {phoneCodes?.map((code) => (
                <option key={code.countryPhoneId} value={code.countryPhoneId}>
                  {code.phoneCode}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium">
            {t("manager.form.phoneNumber")}
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            value={userData.phoneNumber}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          />
        </div>



      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/managers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {t("cancel")}{" "}
        </Link>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={status === "loading"}
        >
          {status === "loading"
            ? t("manager.submit.creating")
            : t("manager.submit.create")}
        </button>      </div>
    </form>
  );
}
