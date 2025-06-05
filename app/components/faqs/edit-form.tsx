"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
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

export default function UpdateFaqForm({
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
  const { id } = useParams();
  const [formState, setFormState] = useState<FormState>({
    id: 0,
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
    if (questionId !== null) {
      dispatch(getQuestionDetail({ questionId, languageId }));
    }
  }, [dispatch, questionId, languageId]);

  useEffect(() => {
    if (selectedQuestionDetail) {
      setFormState({
        id: Number(id),
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLocalizedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    languageId: number
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      frequentlyAskedQuestionsLocalized:
        prevState.frequentlyAskedQuestionsLocalized.map((item) =>
          item.languageId === languageId ? { ...item, [name]: value } : item
        ),
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const hasChanges =
      formState.question !== selectedQuestionDetail?.title ||
      formState.detail !== selectedQuestionDetail?.detail ||
      formState?.frequentlyAskedQuestionsLocalized?.some((localization) => {
        const originalLocalization = selectedQuestionDetail?.languages.find(
          (lang) => lang.languageId === localization.languageId
        );
        return (
          originalLocalization &&
          (localization.question !== originalLocalization.title ||
            localization.detail !== originalLocalization.detail)
        );
      });

    if (!hasChanges) {
      alert(t("faq.messages.nothingToUpdate"));
      return;
    }

    const questionToSend: FrequentlyAskedQuestionUpdate = {
      id: Number(formState.id),
      question: formState.question,
      detail: formState.detail,
      frequentlyAskedQuestionsLocalized:
        formState.frequentlyAskedQuestionsLocalized.map((localization) => ({
          languageId: localization.languageId,
          question: localization.question,
          detail: localization.detail,
        })),
    };

    try {
      await dispatch(updateQuestion(questionToSend)).unwrap();
      alert(t("faq.messages.updateSuccess"));
      router.replace("/dashboard/faqs");
    } catch (error) {
      alert(t("faq.messages.updateFailure"));
      console.error("Update Question Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <form className="my-6" onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="question" className="mb-2 block text-sm font-medium">
            {t("faq.form.title")}{" "}
          </label>
          <input
            type="text"
            id="question"
            name="question"
            value={formState.question}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            required
            placeholder={t("faq.form.enterTitleTr")}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="detail" className="mb-2 block text-sm font-medium">
            {t("faq.form.detail")}{" "}
          </label>
          <textarea
            id="detail"
            name="detail"
            value={formState.detail}
            onChange={handleChange}
            className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder={t("faq.form.enterDetailTr")}
            style={{ height: "150px", width: "100%" }}
          />
        </div>
        {languages.map((lang) => {
          const localizedData =
            formState.frequentlyAskedQuestionsLocalized.find(
              (item) => item.languageId === lang.languageId
            ) || { question: "", detail: "" };

          return (
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
                  value={localizedData.question}
                  onChange={(e) => handleLocalizedChange(e, lang.languageId)}
                  className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                  placeholder={t("faq.form.enterTitle", {
                    lang: lang.languageId === 1 ? "TR" : "EN",
                  })}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor={`localized_detail_${lang.languageId}`}
                  className="mb-2 block text-sm font-medium"
                >
                  {t("faq.form.detail")} (
                  {lang.languageId === 1 ? "Turkish" : "English"})
                </label>
                <textarea
                  id={`localized_detail_${lang.languageId}`}
                  name="detail"
                  value={localizedData.detail}
                  onChange={(e) => handleLocalizedChange(e, lang.languageId)}
                  className="text-gray-500 block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                  placeholder={t("faq.form.enterDetail", {
                    lang: lang.languageId === 1 ? "TR" : "EN",
                  })}
                  style={{ height: "150px", width: "100%" }}
                  required
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/faqs"
          className="flex h-10 items-center rounded-lg bg-gray-200 px-4 font-medium text-gray-700 transition hover:bg-gray-300"
        >
          {t("cancel")}
        </Link>
        <Button type="submit" className="h-10">
          {t("update")}
        </Button>
      </div>
    </form>
  );
}
