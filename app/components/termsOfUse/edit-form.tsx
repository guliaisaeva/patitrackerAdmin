"use client";

import {
  fetchTermsOfUse,
  selectAllTerms,
  updateTermsOfUse,
} from "@/lib/features/termsPrivacy/termsPrivacySlice";
import { AppDispatch } from "@/lib/store";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../button";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";
import styles from "./terms.module.css";
import 'react-quill-new/dist/quill.snow.css';
import "react-quill-new/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function TermsOfUseTableEdit() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const languageId = searchParams.get("languageId");
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const termsOfUse = useSelector(selectAllTerms);

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  const modules = {
    toolbar: [
      [{ header: [2, 3] }, { header: "3" }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ["bold", "italic", "underline"],
      ["link"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    // "bullet",
    "indent",
    "link",
    "image",
  ];

  useEffect(() => {
    if (id && languageId) {
      const term = termsOfUse.find(
        (term) =>
          term.id === Number(id) && term.languageId === Number(languageId)
      );
      if (term) {
        setTitle(term.title);
        setDetail(term.detail);
      } else {
        dispatch(fetchTermsOfUse(Number(languageId)));
      }
    }
  }, [id, languageId, dispatch, termsOfUse]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (title && detail) {
      const sanitizedTitle = DOMPurify.sanitize(title, {
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
      });

      // Sanitize detail with allowed tags and attributes
      const sanitizedDetail = DOMPurify.sanitize(detail, {
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
        ], // Allowed tags for detail
        ALLOWED_ATTR: ["href", "target", "rel"], // Allowed attributes for links
      });

      const updatedTerm = {
        id: Number(id),
        title: sanitizedTitle,
        detail: sanitizedDetail,
        languageId: Number(languageId),
      };
      await dispatch(updateTermsOfUse(updatedTerm));
      await dispatch(fetchTermsOfUse());
      router.push(`/dashboard/termsOfUse`);
    }
  };

  return (
    <div className="mb-2 w-full bg-white p-4">
      <h1 className="text-sm text-gray-500 text-center font-bold p-2">
        {t("Edit Terms of Use")}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.quillEditor}>
          <label className="block text-gray-700" htmlFor="title">
            {t("Title")}
          </label>
          {/* <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          /> */}
        </div>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update the title state on change
          className={`text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm`}
        />
        <div className={styles["quill-editor"]}>
          <label className="block text-gray-700" htmlFor="detail">
            {t("Detail")}
          </label>
          {/* <textarea
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          /> */}
          <ReactQuill
            id="detail"
            value={detail}
            onChange={setDetail} // Update the detail state on change
            theme="snow" // You can choose a theme here
            modules={modules}
            formats={formats}
            className={`text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm`}
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/termsOfUse"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t("cancel")}
          </Link>
          <Button type="submit" className="h-10">
            {t("update")}
          </Button>
        </div>
      </form>
    </div>
  );
}
