// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchLanguages,
//   selectLanguages,
// } from "@/lib/features/languages/languagesSlice";
// import TermsOfUseTable from "./termsOfUse/table";
// import { AppDispatch } from "@/lib/store";

// function LanguageTabs({ selectedLanguageId }: { selectedLanguageId: number }) {
//   const dispatch = useDispatch<AppDispatch>();
//   const languages = useSelector(selectLanguages);
//   const [openTab, setOpenTab] = useState<number>(selectedLanguageId || 1); // Default to 1 if no selectedLanguageId
//   const [showTermsOfUse, setShowTermsOfUse] = useState<boolean>(true);
//   useEffect(() => {
//     dispatch(fetchLanguages());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedLanguageId) {
//       setOpenTab(selectedLanguageId);
//     }
//   }, [selectedLanguageId]);

//   const handleTabClick = (languageId: number) => {
//     setOpenTab(languageId);
//   };
//   const handleToggle = () => {
//     setShowTermsOfUse(!showTermsOfUse); // Toggle between Terms of Use and Privacy Policy
//   };
//   const tabClassName = (languageId: number) =>
//     `text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
//       openTab === languageId
//         ? "text-white bg-green-500"
//         : "text-blueGray-600 bg-white"
//     }`;

//   const tabContent = useMemo(
//     () =>
//       languages.map((language) => (
//         <div
//           key={language.languageId}
//           className={openTab === language.languageId ? "block" : "hidden"}
//           id={language.languageAbbreviation}
//           role="tabpanel"
//           aria-labelledby={`tab-${language.languageId}`}
//         >
//           <TermsOfUseTable languageId={language.languageId} />
//         </div>
//       )),
//     [languages, openTab]
//   );

//   if (languages.length === 0) {
//     return <div>No languages available.</div>;
//   }

//   return (
//     <div className="w-full">
//       <ul
//         className="flex mb-0 list-none flex-wrap pt-3 pb-4 justify-end"
//         role="tablist"
//       >
//         {languages.map((language) => (
//           <li key={language.languageId} className="flex-none mr-2 last:mr-0">
//             <a
//               className={tabClassName(language.languageId)}
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleTabClick(language.languageId);
//               }}
//               href={`#${language.languageAbbreviation}`}
//               role="tab"
//               aria-selected={openTab === language.languageId}
//               aria-controls={language.languageAbbreviation}
//               tabIndex={0}
//             >
//               {language.languageName}
//             </a>
//           </li>
//         ))}
//       </ul>

//       <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
//         <div className="px-4 py-5 flex-auto">
//           <div className="tab-content tab-space">{tabContent}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LanguageTabs;

"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLanguages,
  selectLanguages,
} from "@/lib/features/languages/languagesSlice";
import { AppDispatch } from "@/lib/store";

interface LanguageTabsProps {
  selectedLanguageId: number;
  renderContent: (languageId: number) => React.ReactNode; // Function to render content based on the selected language
}

function LanguageTabs({
  selectedLanguageId,
  renderContent,
}: LanguageTabsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const languages = useSelector(selectLanguages);
  const [openTab, setOpenTab] = useState<number>(selectedLanguageId || 1); // Default to 1 if no selectedLanguageId

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLanguageId) {
      setOpenTab(selectedLanguageId);
    }
  }, [selectedLanguageId]);

  const handleTabClick = (languageId: number) => {
    setOpenTab(languageId);
  };

  const tabClassName = (languageId: number) =>
    `text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
      openTab === languageId
        ? "text-white bg-green-500"
        : "text-blueGray-600 bg-white"
    }`;

  const tabContent = useMemo(
    () =>
      languages.map((language) => (
        <div
          key={language.languageId}
          className={openTab === language.languageId ? "block" : "hidden"}
          id={language.languageAbbreviation}
          role="tabpanel"
          aria-labelledby={`tab-${language.languageId}`}
        >
          {renderContent(language.languageId)} {/* Render dynamic content */}
        </div>
      )),
    [languages, openTab, renderContent]
  );

  if (languages.length === 0) {
    return <div>No languages available.</div>;
  }

  return (
    <div className="w-full">
      <ul
        className="flex mb-0 list-none flex-wrap pt-3 pb-4 justify-end"
        role="tablist"
      >
        {languages.map((language) => (
          <li key={language.languageId} className="flex-none mr-2 last:mr-0">
            <a
              className={tabClassName(language.languageId)}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick(language.languageId);
              }}
              href={`#${language.languageAbbreviation}`}
              role="tab"
              aria-selected={openTab === language.languageId}
              aria-controls={language.languageAbbreviation}
              tabIndex={0}
            >
              {language.languageName}
            </a>
          </li>
        ))}
      </ul>

      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="px-4 py-5 flex-auto">
          <div className="tab-content tab-space">{tabContent}</div>
        </div>
      </div>
    </div>
  );
}

export default LanguageTabs;
