"use client";

import { lusitana } from "@/app/components/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useFormStatus } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
  loginUser,
  selectAuthError,
  selectAuthStatus,
  selectAuthToken,
} from "@/lib/features/login/loginSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

// import { authenticate } from '@/app/lib/actions';

export default function LoginForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const token = useSelector(selectAuthToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mobileDeviceToken =
      "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9";

    try {
      const resultAction = await dispatch(
        loginUser({ email, password, mobileDeviceToken })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        // Save token to localStorage
        if (resultAction.payload.token) {
          localStorage.setItem("authToken", resultAction.payload.token);
        }
        router.replace("/dashboard");
      } else if (loginUser.rejected.match(resultAction)) {
        setFormError(resultAction.payload as string);
        setEmail("");
        setPassword("");
        router.replace("/");
      }
    } catch (error) {
      setFormError("An unexpected error occurred.");
      setEmail("");
      setPassword("");
      router.replace("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          {t("login.title")}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              {t("login.emailLabel")}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {t("login.passwordLabel")}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder={t("login.passwordPlaceholder")}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {formError && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{t("login.formError")}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { t } = useTranslation();

  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {t("login.loginButton")}{" "}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
