"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import NoResultsMessage from "@/app/components/noResultMessage";
import { useTranslation } from "react-i18next";
import {
  fetchTermsOfUse,
  selectTermsOfUseByLanguage,
} from "@/lib/features/termsPrivacy/termsPrivacySlice";
import "react-quill-new/dist/quill.snow.css";
import { UpdateTermsOfUse } from "./buttons";
import {
  fetchLanguages,
  selectLanguages,
} from "@/lib/features/languages/languagesSlice";
import DOMPurify from "dompurify";

import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";
import styles from "./terms.module.css";

interface TermsOfUseTableProps {
  languageId?: number;
}
export default function TermsOfUseTable({ languageId }: TermsOfUseTableProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const selectedLanguages = useSelector(selectLanguages);
  const lang = selectedLanguages.find((lang) => lang.languageId === 1) ? 1 : 2;
  const [selectedLanguageId, setSelectedLanguageId] = useState(
    languageId || lang
  );

  const status = useSelector((state: RootState) => state.termsPrivacy.status);

  useEffect(() => {
    if (selectedLanguageId) {
      dispatch(fetchTermsOfUse(selectedLanguageId));
    }
    dispatch(fetchLanguages());
  }, [dispatch, selectedLanguageId]);

  const termsOfUse = useSelector((state: RootState) =>
    selectTermsOfUseByLanguage(state, selectedLanguageId)
  );
  if (status === "loading") {
    return <div>{t("terms.submit.loading")}</div>;
  }

  if (!termsOfUse || termsOfUse.length === 0) {
    return <NoResultsMessage />;
  }
  return (
    <div className="mt-6 flow-root">
      {termsOfUse?.map((item) => (
        <div key={item.id} className="mb-2 w-full  bg-white p-4">
          <div className="flex justify-end">
            <UpdateTermsOfUse id={item.id} languageId={selectedLanguageId} />
          </div>

          <h1
            className={`${styles.quillEditor} text-center font-bold`}
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
          <div
            className={`${styles.quillEditor} mt-4`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(item.detail, {
                ALLOWED_TAGS: [
                  "b",
                  "i",
                  "em",
                  "strong",
                  "a",
                  "ul",
                  "ol",
                  "li",
                  "h1",
                  "h2",
                  "h3",
                  "u",
                ],
                ALLOWED_ATTR: ["href", "rel", "target"],
              }),
            }}
          />
        </div>
      ))}
    </div>
  );
}
