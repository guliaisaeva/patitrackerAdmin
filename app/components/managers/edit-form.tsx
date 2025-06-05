"use client";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/components/button";
import Image from "next/image";
import {
  selectManagerById,
  getManagerByIdAsync,
  getAllCitiesAsync,
  selectCities,
  selectDistricts,
  getAllDistrictsAsync,
  updateSuperAdminProfileAsync,
  ManagerById,
  selectPhoneCodes,
  getAllPhoneCodesAsync,
} from "@/lib/features/managers/managersSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";


export default function EditManagerForm({ managerId }: { managerId: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const selectedManagerById = useSelector(selectManagerById);
  const cities = useSelector(selectCities);
  const districts = useSelector(selectDistricts);
  const phoneCodes = useSelector(selectPhoneCodes);

  const [selectedCityId, setSelectedCityId] = useState<any | null>(
    selectedManagerById?.userAddress?.cityId || null
  );
  const [selectedCountryId, setSelectedCountryId] = useState<number>(0);

  const [selectedDistrictId, setSelectedDistrictId] = useState<any | null>(
    selectedManagerById?.userAddress?.districtId || null
  );

  useEffect(() => {
    if (managerId) {
      dispatch(getManagerByIdAsync(managerId));
    }
  }, [dispatch, managerId]);
  useEffect(() => {
    dispatch(getAllCitiesAsync());
    dispatch(getAllPhoneCodesAsync())

  }, [dispatch]);

  useEffect(() => {
    if (selectedCityId !== null) {
      dispatch(getAllDistrictsAsync(selectedCityId));
    }
  }, [dispatch, selectedCityId]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    selectedManagerById?.userAddress?.phoneNumber || ""
  );
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>(selectedManagerById?.userAddress?.zipCode || "");
  const [description, setDescription] = useState<string>("");
  const [direction, setDirection] = useState<string>("");


  useEffect(() => {
    if (selectedManagerById) {
      setFirstName(selectedManagerById.firstName || "");
      setLastName(selectedManagerById.lastName || "");
      setPhoneNumber(selectedManagerById.phoneNumber || "");
      setZipCode(selectedManagerById.userAddress?.zipCode || "");
      setDescription(selectedManagerById.userAddress?.description || "");
      setDirection(selectedManagerById.userAddress?.direction || "");
      setSelectedCityId(selectedManagerById.userAddress?.cityId || "");
      setSelectedDistrictId(selectedManagerById.userAddress?.districtId || "");
      setSelectedCountryId(selectedManagerById.userAddress?.countryPhoneCodeId || 0)
    }
  }, [selectedManagerById]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedManagerById) return;
    // const selectedCityName = cities.find(c => c.cityId === selectedCityId)?.cityName || '';
    const selectedDistrictName = districts.find(d => d.districtId === selectedDistrictId)?.districtName || '';

    const updatedData = {
      userProfileId: selectedManagerById.userProfileId,
      firstName,
      lastName,

      userAddress: {
        cityId: selectedCityId.toString(),
        cityName: selectedCityName || selectedManagerById.userAddress?.cityName,
        districtId: selectedDistrictId.toString(),
        districtName: selectedDistrictName,
        description: description,
        direction: direction,
        zipCode: zipCode,
        countryPhoneCodeId: selectedCountryId,
        phoneCode: selectedManagerById.userAddress?.phoneCode,
        phoneNumber: phoneNumber
      },
    };

    dispatch(updateSuperAdminProfileAsync(updatedData))
      .unwrap()
      .then((data) => {
        console.log('Thunk success:', data);
        alert(t("manager.messages.updateSuccess"));
        router.replace("/dashboard/managers");

      })
      .catch((err) => {
        console.error('Thunk error:', err);
        alert(t("manager.messages.updateFailure"));

      });
  };



  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const selectedCity = cities.find(city => city.cityId === selectedId);
    setSelectedCityId(selectedId);
    setSelectedCityName(selectedCity?.cityName || "");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = parseInt(e.target.value);
    setSelectedDistrictId(districtId);
  };
  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4 flex items-center justify-center">
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
        </div>

        <div className="mb-4">
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
            {t("manager.form.manager.name")}
          </label>
          <div className="relative">
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}

              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="userName-error"
            />
          </div>
          <div id="userName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
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
              value={lastName || ""}
              className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="lastName-error"
              onChange={(e) => setLastName(e.target.value)}

            />
          </div>
          <div id="userName-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
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
                value={zipCode || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="zipCode-error"
                onChange={(e) => setZipCode(e.target.value)}


              />
            </div>
          </div>
          <div id="zipCode-error" aria-live="polite" aria-atomic="true">
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            {t("manager.form.adresDescription")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
                type="text"
                value={description || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="description-error"
                onChange={(e) => setDescription(e.target.value)}


              />
            </div>
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
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
                value={direction || ""}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="direction-error"
                onChange={(e) => setDirection(e.target.value)}

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
              value={selectedCountryId}
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                setSelectedCountryId(selectedId);
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
          <label
            htmlFor="phoneNumber"
            className="mb-2 block text-sm font-medium"
          >
            {t("manager.form.manager.phone.number")}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={phoneNumber}
                className="text-gray-500 peer block w-full rounded-md border border-gray-200 py-2  text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="phoneNumber-error"
                onChange={(e) => setPhoneNumber(e.target.value)}

              />
            </div>

          </div>
          <div id="phoneNumber-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
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
          <div id="cityId-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
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
          <div id="districtId-error" aria-live="polite" aria-atomic="true">
            {/* Error handling if needed */}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/managers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {t("cancel")}{" "}
        </Link>
        <Button type="submit">{t("update")}</Button>
      </div>
    </form>
  );
}
