"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  getAllSimsForConnectDeviceAsync,
  selectSimWithDevice,
} from "@/lib/features/sims/simsSlice";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  addDeviceAsync,
  DeviceToAdd,
  selectDevicesError,
  selectDevicesStatus,
} from "@/lib/features/devices/devicesSlice";

export default function Form() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const status = useSelector(selectDevicesStatus);
  const error = useSelector(selectDevicesError);
  const SimWithDevice = useSelector(selectSimWithDevice);
  const [deviceNumberError, setDeviceNumberError] = useState("");
  const [deviceModelError, setDeviceModelError] = useState("");

  const [deviceData, setDeviceData] = useState<DeviceToAdd>({
    deviceNumber: "",
    deviceModel: "",
    isDeviceToSim: false,
    simCardId: 0,
  });

  useEffect(() => {
    dispatch(getAllSimsForConnectDeviceAsync());
  }, [dispatch]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const dataToSend: DeviceToAdd[] = [
        {
          ...deviceData,
          simCardId: deviceData.isDeviceToSim ? deviceData.simCardId : 0,
        },
      ];
      const resultAction = await dispatch(addDeviceAsync(dataToSend));

      if (addDeviceAsync.rejected.match(resultAction)) {
        console.error("Action rejected:", resultAction);
        alert(t("device.messages.createFailure"));
        return;
      }

      if (resultAction.payload && resultAction.payload.statusCode === 200) {
        setDeviceData({
          deviceNumber: "",
          deviceModel: "",
          isDeviceToSim: false,
          simCardId: 0,
        });
        alert(t("device.messages.createSuccess"));
        router.replace("/dashboard/devices");
      } else {
        alert(t("device.messages.createFailure"));
      }
    } catch (err) {
      console.error("Error during device addition:", err);
      alert(t("device.messages.createFailure"));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    if (name === "deviceNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 15);
      setDeviceData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));

      if (numericValue.length === 15) {
        setDeviceNumberError("");
      } else {
        setDeviceNumberError(t("device.form.deviceNumberValid"));
      }
    } else if (name === "deviceModel") {
      const trimmedValue = value.slice(0, 20);
      setDeviceData((prevData) => ({
        ...prevData,
        [name]: trimmedValue,
      }));

      if (trimmedValue.length < 20) {
        setDeviceModelError("");
      } else {
        setDeviceModelError(t("device.form.deviceModelValid"));
      }
    } else {
      setDeviceData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label
            htmlFor="deviceNumber"
            className="mb-2 block text-sm font-medium"
          >
            {t("device.form.deviceNumber")}{" "}
          </label>
          <input
            type="text"
            id="deviceNumber"
            name="deviceNumber"
            value={deviceData.deviceNumber}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            required
            placeholder={t("device.form.enterDeviceNumber")}
          />
          {deviceNumberError && (
            <div className="text-green-500 text-sm mt-1">
              {deviceNumberError}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="deviceModel"
            className="mb-2 block text-sm font-medium"
          >
            {t("device.form.deviceModel")}{" "}
          </label>
          <input
            id="deviceModel"
            name="deviceModel"
            type="text"
            value={deviceData.deviceModel}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("device.form.enterDeviceModel")}
            required
          />
          {deviceModelError && (
            <div className="text-green-500 text-sm mt-1">
              {deviceModelError}
            </div>
          )}
        </div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className=" mb-4 md:mb-0 md:w-1/4 flex items-center ">
            <input
              type="checkbox"
              id="isDeviceToSim"
              name="isDeviceToSim"
              checked={deviceData.isDeviceToSim}
              onChange={handleChange}
              className="h-5 w-5 cursor-pointer border-gray-300 bg-gray-100 text-green-500 focus:ring-2  focus:ring-green-500"
            />
            <label
              htmlFor="isDeviceToSim"
              className="ml-2 cursor-pointer text-sm"
            >
              {t("device.form.saveToSimCard")}{" "}
            </label>
          </div>

          {deviceData.isDeviceToSim && (
            <div className="md:w-3/4">
              <label
                htmlFor="simCardId"
                className="mb-2 block text-sm font-medium"
              >
                {t("device.form.simNumber")}{" "}
              </label>
              <select
                id="simCardId"
                name="simCardId"
                value={deviceData.simCardId}
                onChange={handleSelectChange}
                className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              >
                <option value="">{t("device.form.selectSimNumber")}</option>
                {SimWithDevice?.map((sim: any) => (
                  <option key={sim?.simCardId} value={sim.simCardId}>
                    {sim.simCardNumber}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {status === "failed" && error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/devices"
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
              ? t("device.submit.creating")
              : t("device.submit.create")}
          </button>
        </div>
      </div>
    </form>
  );
}
