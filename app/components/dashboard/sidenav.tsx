"use client";
import Link from "next/link";
import NavLinks from "@/app/components/dashboard/nav-links";
import { PowerIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/lib/store";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/features/login/loginSlice";
import { useTranslation } from "react-i18next";
import logo from "@/public/logo/patitracker_logo.png";
import { useState } from "react";

export default function SideNav() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 ">
      <Link
        className="mb-2 flex h-20 items-end justify-center rounded-md bg-customGray p-4 md:h-40"
        href="/"
      >
        <div className="w-32 h-full text-white flex items-center justify-center md:w-40">
          <Image
            src={logo}
            alt="logo"
            width={100 * (138 / 162)}
            height={100}
            className="w-16 h-16 md:w-24 md:h-24"
            priority
          />
        </div>
      </Link>
      <div className="grow flex-row justify-between space-y-2 md:flex-col md:space-x-0 md:space-y-2">
        <button
          className="md:hidden  m-3  flex items-left bg-transparent"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XMarkIcon className=" w-6 h-6 text-orange-600" />
          ) : (
            <Bars3Icon className="w-8 h-8 text-orange-600" />
          )}
        </button>
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:block w-full md:w-auto space-y-2`}
        >
          <NavLinks />
        </div>

        <button
          onClick={handleLogout}
          className="hidden md:flex h-[48px] w-full grow text-black items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6 " />
          <div className="hidden md:block">{t("sign.out")}</div>
        </button>
      </div>
    </div>
  );
}
