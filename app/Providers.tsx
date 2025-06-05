"use client";

import React, { useEffect, useState } from "react";
import { StoreProvider } from "./StoreProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

const SafeHydrate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    return <>{children}</>;
};

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SafeHydrate>
            <StoreProvider>
                <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
            </StoreProvider>
        </SafeHydrate>
    );
}
