"use client";

import {
  AdminPanelSettings,
  DeviceHub,
  Group,
  Home,
  Pets,
  SimCard,
  ArrowDropDown,
  Apps,
  Campaign,
  QuestionMark,
  Grading,
  PrivacyTip,
  InfoOutlined
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const links = [
  { name: "home", href: "/dashboard", icon: Home },
  { name: "managers", href: "/dashboard/managers", icon: AdminPanelSettings },
  { name: "users", href: "/dashboard/customers", icon: Group },
  { name: "devices", href: "/dashboard/devices", icon: DeviceHub },
  { name: "devicesState", href: "/dashboard/devices-state", icon:  InfoOutlined },
  { name: "simCards", href: "/dashboard/simcards", icon: SimCard },
  {
    name: "pet.management",
    href: "#",
    icon: Pets,
    submenu: [
      // { name: "pet.type", href: "/dashboard/pets/petType", icon: Grain },
      { name: "pet.breed", href: "/dashboard/pets/petBreed", icon: Apps },
    ],
  },
  { name: "announcements", href: "/dashboard/announcements", icon: Campaign },
  { name: "faqs", href: "/dashboard/faqs", icon: QuestionMark },
  { name: "terms", href: "/dashboard/termsOfUse", icon: Grading },
  { name: "privacy", href: "/dashboard/privacyPolicy", icon: PrivacyTip },
];

export default function NavLinks() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !Object.values(buttonRefs.current).some((button) =>
        button?.contains(event.target as Node)
      )
    ) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (i18n.isInitializing) {
    return <div>{t("load")}</div>;
  }
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        if (link.submenu) {
          return (
            <div key={link.name} className="relative">
              <button
                ref={(el: any) => (buttonRefs.current[link.name] = el)}
                onClick={() => toggleDropdown(link.name)}
                className={clsx(
                  "flex items-center justify-between gap-2 rounded-md text-orange-500 bg-gray-50 p-3 text-sm font-medium hover:bg-green-200 hover:text-green-600 w-full",
                  {
                    "bg-green-100 text-green-600": link.submenu.some(
                      (submenuItem) => pathname.startsWith(submenuItem.href)
                    ), // Check if any submenu item is active
                  }
                )}
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-6" />
                  <p className="md:block ">{t(`navLinks.${link.name}`)}</p>
                </div>
                <ArrowDropDown className="w-5 ml-2 -mr-1" />
              </button>

              {openDropdown === link.name && (
                <div
                  ref={dropdownRef}
                  className="relative mt-1 w-full bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1">
                    {link.submenu.map((submenuItem) => (
                      <Link
                        key={submenuItem.name}
                        href={submenuItem.href}
                        passHref
                        className={clsx(
                          "flex items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 w-full",
                          {
                            "bg-green-100 text-green-600":
                              pathname === submenuItem.href,
                          }
                        )}
                      >
                        {submenuItem.icon && (
                          <submenuItem.icon className="w-6" />
                        )}
                        {t(`navLinks.${submenuItem.name}`)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] items-left  gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 w-full md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-green-100 text-green-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="md:block">{t(`navLinks.${link.name}`)}</p>
          </Link>
        );
      })}
    </>
  );
}

// "use client";

// import {
//   AdminPanelSettings,
//   DeviceHub,
//   Group,
//   Home,
//   Pets,
//   SimCard,
//   ArrowDropDown,
//   Grain,
//   Apps,
//   Campaign,
//   QuestionMark,
// } from "@mui/icons-material";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";
// import { useState, useRef, useEffect } from "react";
// import { useTranslation } from "react-i18next";

// const links = [
//   { name: "home", href: "/dashboard", icon: Home },
//   { name: "managers", href: "/dashboard/managers", icon: AdminPanelSettings },
//   { name: "users", href: "/dashboard/customers", icon: Group },
//   { name: "devices", href: "/dashboard/devices", icon: DeviceHub },
//   { name: "simCards", href: "/dashboard/simcards", icon: SimCard },
//   {
//     name: "pet.management",
//     href: "#",
//     icon: Pets,
//     submenu: [
//       { name: "pet.type", href: "/dashboard/pets/petType", icon: Grain },
//       { name: "pet.breed", href: "/dashboard/pets/petBreed", icon: Apps },
//     ],
//   },
//   { name: "announcements", href: "/dashboard/announcements", icon: Campaign },
//   { name: "faqs", href: "/dashboard/faqs", icon: QuestionMark },
// ];

// export default function NavLinks() {
//   const { t, i18n } = useTranslation();
//   const pathname = usePathname();
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

//   const toggleDropdown = (name: string) => {
//     setOpenDropdown(openDropdown === name ? null : name);
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       dropdownRef.current &&
//       !dropdownRef.current.contains(event.target as Node) &&
//       !Object.values(buttonRefs.current).some((button) =>
//         button?.contains(event.target as Node)
//       )
//     ) {
//       setOpenDropdown(null);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (i18n.isInitializing) {
//     return <div>{t("load")}</div>;
//   }

//   return (
//     <>
//       {links.map((link) => {
//         const LinkIcon = link.icon;

//         if (link.submenu) {
//           return (
//             <div key={link.name} className="relative">
//               <button
//                 ref={(el: any) => (buttonRefs.current[link.name] = el)}
//                 onClick={() => toggleDropdown(link.name)}
//                 className={clsx(
//                   "flex items-center justify-between gap-2 rounded-md text-orange-500 bg-gray-50 p-3 text-sm font-medium hover:bg-green-200 hover:text-green-600 w-full",
//                   {
//                     "bg-green-100 text-green-600": link.submenu.some(
//                       (submenuItem) => pathname.startsWith(submenuItem.href)
//                     ),
//                   }
//                 )}
//               >
//                 <div className="flex items-center gap-2">
//                   <LinkIcon className="w-6" />
//                   <p className="hidden md:block ">
//                     {t(`navLinks.${link.name}`)}
//                   </p>
//                 </div>
//                 <ArrowDropDown className="w-5 ml-2 -mr-1" />
//               </button>

//               {openDropdown === link.name && (
//                 <div
//                   ref={dropdownRef}
//                   className="absolute left-0 mt-1 w-full bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
//                 >
//                   <div className="py-1">
//                     {link.submenu.map((submenuItem) => (
//                       <Link
//                         key={submenuItem.name}
//                         href={submenuItem.href}
//                         className={clsx(
//                           "flex items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 w-full",
//                           {
//                             "bg-green-100 text-green-600":
//                               pathname === submenuItem.href,
//                           }
//                         )}
//                       >
//                         {submenuItem.icon && (
//                           <submenuItem.icon className="w-6" />
//                         )}
//                         {t(`navLinks.${submenuItem.name}`)}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         }

//         return (
//           <Link
//             key={link.name}
//             href={link.href}
//             className={clsx(
//               "flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 w-full",
//               {
//                 "bg-green-100 text-green-600": pathname === link.href,
//               }
//             )}
//           >
//             <LinkIcon className="w-6" />
//             <p className="hidden md:block">{t(`navLinks.${link.name}`)}</p>
//           </Link>
//         );
//       })}
//     </>
//   );
// }
