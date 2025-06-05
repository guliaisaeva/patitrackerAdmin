
"use client";

import React, { useState, useEffect, Fragment, useRef } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { getDevicesAsync } from "@/lib/features/devices/devicesSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { lusitana } from "@/app/components/fonts";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { DeviceMapIframe } from "@/app/components/deviceMap";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then(res => res.json());
interface VirtualFenceCorner {
  Latitude: number;
  Longitude: number;
}

interface VirtualFence {
  ShapeType: number;
  Radius: number;
  CenterPoint: null | unknown;
  Corners: VirtualFenceCorner[];
}

interface MongoDevice {
  _id: string;
  DeviceID: string;
  Latitude: number;
  Longitude: number;
  Battery: number;
  LastValueUpdated: number;
  IsWalkStarted: boolean;
  WalkOid: null | unknown;
  BatteryLowNotified: boolean;
  VirtualFence: VirtualFence | null;
  IsOutOfVirtualFence: boolean;
  IsActive: boolean;
  RealtimeTrackingStatusId: number;
  RealtimeTrackingStatus: string | null;
  RealtimeTrackingValidTill: number;
  FcmToken: null | unknown;
  GpsLocation: boolean;
  WifiLocation: boolean;
  LbsLocation: boolean;
  BleLocation: boolean;
  BeaconLocation: boolean;
  HomeWifiLocation: boolean;
  InCharging: boolean;
  FullyCharged: boolean;
  Rebooted: boolean;
  HistoricalData: boolean;
  AgpsValid: boolean;
  BleConnected: boolean;
  Indoors: boolean;
  WorkMode: number;
  GsmSignalStrength: number;
}


export default function DeviceCombobox() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const devices = useSelector((state: RootState) => state.devices.devices);

  const [query, setQuery] = useState("");
  const [selectedDeviceNumber, setSelectedDeviceNumber] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);



  const { data: devicesMongo, error } = useSWR(
    selectedDeviceNumber ? `/api/getMongoData?deviceId=${selectedDeviceNumber}` : null,
    fetcher,
    {
      refreshInterval: 10000,
    }
  );




  useEffect(() => {
    dispatch(getDevicesAsync());
  }, [dispatch]);


  const filteredDevices =
    query === ""
      ? devices
      : devices?.filter(
        (device) =>
          device.deviceNumber.toLowerCase().includes(query.toLowerCase()) ||
          device.deviceModel.toLowerCase().includes(query.toLowerCase()) ||
          device.simNumber.toLowerCase().includes(query.toLowerCase())
      );


  const detailedDevice = devicesMongo;


  const date = Math.floor(Date.now() / 1000)

  return (
    <div className="w-full ">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {t("deviceStatus.deviceStatus")}
        </h1>
      </div>
      <div className="mt-4  md:mt-8">
        <Combobox
          value={selectedDeviceNumber}
          onChange={setSelectedDeviceNumber}

        >
          <div className="relative">
            <ComboboxInput
              className="border border-gray-300 rounded-md p-2 w-full pr-10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("deviceStatus.search.placeholder")}
              onFocus={() => setIsOpen(true)}
              displayValue={(deviceNumber: string) => deviceNumber || ""}
            />
            <ChevronDownIcon
              className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
              show={isOpen}
            >
              <ComboboxOptions className="border border-gray-300 mt-1 max-h-60 overflow-auto rounded-md bg-white shadow-lg z-10">
                {filteredDevices?.length === 0 && (
                  <div className="p-2 text-gray-500">{t('deviceStatus.noDevice')}</div>
                )}

                {filteredDevices?.map((device) => (
                  <ComboboxOption
                    key={device.id}
                    value={device.deviceNumber}
                    className={({ selected }) =>
                      `cursor-pointer select-none p-2 ${selected ? "bg-blue-600 text-white" : "text-gray-900"
                      }`
                    }
                  >
                    {device.deviceModel} - {device.deviceNumber}

                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Transition>
          </div>
        </Combobox>

      </div>

      {selectedDeviceNumber && detailedDevice && (
        <div className="w-full flex flex-col md:flex-row gap-6 my-5">
          <div className="flex-1 p-4 md:p-6 bg-white rounded-lg shadow-md border border-gray-200 ">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 md:text-base">{t("deviceStatus.deviceDetails")}</h2>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">{t("deviceStatus.deviceNumber")}:</span> {selectedDeviceNumber}</p>
              <p>
                <span className="font-semibold">{t("deviceStatus.activityState")}:</span>{" "}
                <span className={`font-semibold ${detailedDevice.IsActive ? "text-green-600" : "text-red-600"}`}>
                  {detailedDevice.IsActive ? t("deviceStatus.active") : t("deviceStatus.inactive")}
                </span>
              </p>

              <p>
                <span className="font-semibold">{t("deviceStatus.realtimeTrackingStatus")}:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold inline-block ${detailedDevice.RealtimeTrackingValidTill < Math.floor(Date.now() / 1000) &&
                    detailedDevice.RealtimeTrackingStatusId === 1
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                    }`}
                >

                  {detailedDevice.RealtimeTrackingValidTill < Math.floor(Date.now() / 1000) &&
                    detailedDevice.RealtimeTrackingStatusId === 1
                    ? "On"
                    : "Off"}
                </span>

              </p>
              <p><span className="font-semibold">{t("deviceStatus.deviceBattery")}:</span> {detailedDevice.Battery ?? "N/A"}</p>
              <p><span className="font-semibold">{t("deviceStatus.deviceWorkMode")}:</span> {detailedDevice.WorkMode ?? "N/A"}</p>
              <p><span className="font-semibold">{t("deviceStatus.deviceGsmSignalStrength")}:</span> {detailedDevice.GsmSignalStrength ?? "N/A"}</p>
            </div>
          </div>

          <div className="flex-1 rounded-lg  shadow-md border border-gray-200 h-64 md:h-auto p-2 bg-white min-w-0 ">
            <DeviceMapIframe lat={detailedDevice.Latitude} lng={detailedDevice.Longitude} />
          </div>
        </div>
      )}

      {selectedDeviceNumber && !detailedDevice && (
        <div className="mt-6 p-4 border rounded bg-yellow-50 text-yellow-800">
          {t("deviceStatus.detailsNotFound")}
        </div>
      )}
    </div>
  );
}
