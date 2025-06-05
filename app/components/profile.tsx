// "use client";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "@/lib/store";

// import { selectAuthUser } from "@/lib/features/login/loginSlice";
// import { useTranslation } from "react-i18next";
// import {
//   getSuperAdminDetailAsync,
//   selectSuperAdmin,
// } from "@/lib/features/users/usersSlice";
// import { useEffect } from "react";

// export default function Profile() {
//   const { t } = useTranslation();
//   const dispatch = useDispatch<AppDispatch>();
//   const user = useSelector(selectAuthUser);
//   const superAdmin = useSelector(selectSuperAdmin);
//   const getInitials = (name: string) => {
//     if (!name) return "";
//     const names = name.split(" ");
//     return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
//   };

//   useEffect(() => {
//     dispatch(getSuperAdminDetailAsync());
//   }, [dispatch]);

//   return (
//     <div className="flex items-center space-x-3 p-3">
//       {superAdmin?.profileImageUrl ? (
//         <img
//           src={superAdmin.profileImageUrl}
//           alt={superAdmin.userName}
//           className="h-10 w-10 rounded-full"
//         />
//       ) : (
//         <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-300 text-white">
//           <span className="text-lg font-semibold">
//             {superAdmin?.userName ? getInitials(superAdmin.userName) : ""}
//           </span>
//         </div>
//       )}
//       <span>{superAdmin?.email || t("guest")}</span>
//     </div>
//   );
// }

"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { logout } from "@/lib/features/login/loginSlice";
import { useTranslation } from "react-i18next";
import {
  getSuperAdminDetailAsync,
  selectSuperAdmin,
} from "@/lib/features/users/usersSlice";
import { useEffect, useRef, useState } from "react";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const superAdmin = useSelector(selectSuperAdmin);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  useEffect(() => {
    dispatch(getSuperAdminDetailAsync());
  }, [dispatch]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center space-x-3 p-3">
      {superAdmin?.profileImageUrl ? (
        <img
          src={superAdmin.profileImageUrl}
          alt={superAdmin.userName}
          className="h-10 w-10 rounded-full"
        />
      ) : (
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-300 text-white">
          <span className="text-lg font-semibold">
            {superAdmin?.userName ? getInitials(superAdmin.userName) : ""}
          </span>
        </div>
      )}
      <span>{superAdmin?.email || t("guest")}</span>
      <button
        className="ml-2 p-2 bg-green-600 rounded-full"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-24  w-38  text-black bg-white rounded-md shadow-lg z-10"
        >
          <button
            onClick={handleLogout}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm text-black font-medium hover:bg-green-100  hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3 "
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">{t("sign.out")}</div>
          </button>
        </div>
      )}
    </div>
  );
}
