import React from "react";
import { useTranslation } from "react-i18next";

const NoResultsMessage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center h-full m-4">
      <div className="bg-gray-100 p-4 rounded-md shadow-md text-center">
        {t("noResults")}
      </div>
    </div>
  );
};

export default NoResultsMessage;
