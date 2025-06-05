"use client"
import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import i18n from '@/lib/i18n';
import { setLanguage } from '@/lib/features/languages/languagesSlice';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  // Ensure the default language is set on mount
  useEffect(() => {
    dispatch(setLanguage(i18n.language as 'en' | 'tr'));
  }, [dispatch]);

  return <>{children}</>;
};