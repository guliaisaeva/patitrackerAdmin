"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  addQuestion,
  selectQuestionsError,
  selectQuestionsStatus,
} from "@/lib/features/faq/faqSlice";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  fetchLanguages,
  selectLanguages,
} from "@/lib/features/languages/languagesSlice";

export default function Form() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const status = useSelector(selectQuestionsStatus);
  const error = useSelector(selectQuestionsError);
  const languages = useSelector(selectLanguages);

  const [formData, setFormData] = useState<{
    question: string;
    detail: string;
    frequentlyAskedQuestionsLocalized: {
      languageId: number;
      question: string;
      detail: string;
    }[];
  }>({
    question: "",
    detail: "",
    frequentlyAskedQuestionsLocalized: [],
  });
  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (languages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        frequentlyAskedQuestionsLocalized: languages.map((lang) => ({
          languageId: lang.languageId,
          question: "",
          detail: "",
        })),
      }));
    }
  }, [languages]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "question" || name === "detail") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name.startsWith("question_") || name.startsWith("detail_")) {
      const [field, languageIdStr] = name.split("_");
      const languageId = parseInt(languageIdStr, 10);

      setFormData((prev) => ({
        ...prev,
        frequentlyAskedQuestionsLocalized:
          prev.frequentlyAskedQuestionsLocalized.map((item) =>
            item.languageId === languageId ? { ...item, [field]: value } : item
          ),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mainQuestion = {
      question: formData.question,
      detail: formData.detail,
      frequentlyAskedQuestionsLocalized:
        formData.frequentlyAskedQuestionsLocalized,
    };

    try {
      await dispatch(addQuestion(mainQuestion)).unwrap();

      setFormData({
        question: "",
        detail: "",
        frequentlyAskedQuestionsLocalized: languages.map((lang) => ({
          languageId: lang.languageId,
          question: "",
          detail: "",
        })),
      });
      alert(t("faq.messages.createSuccess"));
      router.replace("/dashboard/faqs");
    } catch (err) {
      console.error("Failed to add question:", err);
      alert(t("faq.messages.createFailure"));
    }
  };
  return (
    <form onSubmit={handleSubmit} className="my-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="question" className="mb-2 block text-sm font-medium">
            {t("faq.form.title")}
          </label>
          <input
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            required
            placeholder={t("faq.form.enterTitle")}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="detail" className="mb-2 block text-sm font-medium">
            {t("faq.form.detail")}
          </label>
          <textarea
            id="detail"
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("faq.form.enterDetail")}
            required
          />
        </div>

        {languages.map((lang) => (
          <div key={lang.languageId} className="mb-4 mt-4">
            <label
              htmlFor={`question_${lang.languageId}`}
              className="mb-2 flex justify-between text-sm font-medium"
            >
              <p>{t("faq.form.title")}</p>
              {`${lang.languageAbbreviation}/ ${lang.languageName} `}
            </label>
            <input
              type="text"
              id={`question_${lang.languageId}`}
              name={`question_${lang.languageId}`}
              value={
                formData.frequentlyAskedQuestionsLocalized.find(
                  (q) => q.languageId === lang.languageId
                )?.question || ""
              }
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t("faq.form.enterTitle")}
            />

            <label
              htmlFor={`detail_${lang.languageId}`}
              className="mb-2 mt-2 flex justify-between  text-sm font-medium"
            >
              <p> {t("faq.form.detail")}</p>
              {`${lang.languageAbbreviation}/${lang.languageName} `}
            </label>
            <textarea
              id={`detail_${lang.languageId}`}
              name={`detail_${lang.languageId}`}
              value={
                formData.frequentlyAskedQuestionsLocalized.find(
                  (q) => q.languageId === lang.languageId
                )?.detail || ""
              }
              onChange={handleChange}
              className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              placeholder={t("faq.form.enterDetail")}
            />
          </div>
        ))}

        {status === "failed" && error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/faqs"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t("cancel")}
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? t("faq.submit.creating")
              : t("faq.submit.create")}
          </button>
        </div>
      </div>
    </form>
  );
}
