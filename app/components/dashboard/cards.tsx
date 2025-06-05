"use client";

import { useEffect } from "react";
import {
  UserGroupIcon,
  InboxIcon,
  DocumentIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/components/fonts";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { selectUsers, getUsersAsync } from "@/lib/features/users/usersSlice";
import {
  selectDevices,
  getDevicesAsync,
} from "@/lib/features/devices/devicesSlice";
import { selectSims, getAllSimsAsync } from "@/lib/features/sims/simsSlice";
import {
  getAllPetTypes,
  selectPetTypes,
} from "@/lib/features/pet/petTypesSlice";
import { useTranslation } from "react-i18next";

const iconMap = {
  collected: DocumentIcon,
  customers: UserGroupIcon,
  pending: IdentificationIcon,
  invoices: InboxIcon,
};

export default function CardWrapper() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const devices = useSelector(selectDevices);
  const sims = useSelector(selectSims);
  const petTypes = useSelector(selectPetTypes);

  useEffect(() => {
    dispatch(getUsersAsync());
    dispatch(getDevicesAsync());
    dispatch(getAllSimsAsync());
    dispatch(getAllPetTypes());
  }, [dispatch]);

  return (
    <>
      <Card
        title={t("user.count")}
        value={users?.length ?? 0}
        type="customers"
      />
      <Card
        title={t("pet.type.count")}
        value={petTypes?.length ?? 0}
        type="pending"
      />
      <Card
        title={t("device.count")}
        value={devices?.length ?? 0}
        type="invoices"
      />
      <Card
        title={t("sim.card.count")}
        value={sims?.length ?? 0}
        type="collected"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white text-green-600  px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
