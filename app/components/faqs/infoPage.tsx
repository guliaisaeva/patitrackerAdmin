"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  FrequentlyAskedQuestionUpdate,
  getAllQuestions,
  getQuestionDetail,
  selectQuestionDetail,
  updateQuestion,
} from "@/lib/features/faq/faqSlice";
import { useTranslation } from "react-i18next";
import {
  fetchLanguages,
  selectLanguages,
} from "@/lib/features/languages/languagesSlice";
import Link from "next/link";
import { Button } from "@/app/components/button";

interface FrequentlyAskedQuestionsLocalized {
  languageId: number;
  question: string;
  detail: string;
}

interface FormState {
  id: number | null;
  question: string;
  detail: string;
  frequentlyAskedQuestionsLocalized: FrequentlyAskedQuestionsLocalized[];
}

export default function InfoFaqForm({
  questionId,
  languageId,
}: {
  questionId: number;
  languageId: number;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const selectedQuestionDetail = useSelector(selectQuestionDetail);
  const languages = useSelector(selectLanguages);
  const [formState, setFormState] = useState<FormState>({
    id: questionId,
    question: "",
    detail: "",
    frequentlyAskedQuestionsLocalized: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      dispatch(getAllQuestions()),
      dispatch(fetchLanguages()),
    ]).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (questionId) {
      dispatch(getQuestionDetail({ questionId, languageId }));
    }
  }, [dispatch, questionId, languageId]);

  useEffect(() => {
    if (selectedQuestionDetail) {
      setFormState({
        id: selectedQuestionDetail.id || null,
        question: selectedQuestionDetail.title || "",
        detail: selectedQuestionDetail.detail || "",
        frequentlyAskedQuestionsLocalized:
          selectedQuestionDetail?.languages?.map((lang) => ({
            languageId: lang.languageId,
            question: lang.title || "",
            detail: lang.detail || "",
          })) || [],
      });
    }
  }, [selectedQuestionDetail]);

  return (
    <form className="my-6">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="question" className="mb-2 block text-sm font-medium">
            {t("faq.form.title")}{" "}
          </label>
          <input
            type="text"
            id="question"
            name="question"
            defaultValue={formState.question}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("faq.form.enterTitleTr")}
            aria-readonly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="detail" className="mb-2 block text-sm font-medium">
            {t("faq.form.detail")}{" "}
          </label>
          <textarea
            id="detail"
            name="detail"
            defaultValue={formState.detail}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("faq.form.enterDetailTr")}
            style={{ height: "150px", width: "100%" }}
            readOnly
          />
        </div>

        {languages.map((lang, index) => (
          <div key={lang.languageId}>
            <div className="mb-4">
              <label
                htmlFor={`localized_question_${lang.languageId}`}
                className="mb-2 block text-sm font-medium"
              >
                {t("faq.form.title")} (
                {lang.languageId === 1 ? "Turkish" : "English"})
              </label>
              <input
                id={`localized_question_${lang.languageId}`}
                name="question"
                defaultValue={
                  formState.frequentlyAskedQuestionsLocalized[index]
                    ?.question || ""
                }
                className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                placeholder={t("faq.form.enterTitle", {
                  lang: lang.languageId === 1 ? "TR" : "EN",
                })}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor={`detail_${lang.languageId}`}
                className="mb-2 block text-sm font-medium"
              >
                {t("faq.form.detail")} (
                {lang.languageId === 1 ? "Turkish" : "English"})
              </label>
              <textarea
                id={`localized_detail_${lang.languageId}`}
                name="detail"
                defaultValue={
                  formState.frequentlyAskedQuestionsLocalized[index]?.detail ||
                  ""
                }
                className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                placeholder={t("faq.form.enterDetail", {
                  lang: lang.languageId === 1 ? "TR" : "EN",
                })}
                style={{ height: "150px", width: "100%" }}
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/faqs"
          className="flex h-10 items-center rounded-lg bg-gray-200 px-4 font-medium text-gray-700 transition hover:bg-gray-300"
        >
          {t("close")}
        </Link>
      </div>
    </form>
  );
}
