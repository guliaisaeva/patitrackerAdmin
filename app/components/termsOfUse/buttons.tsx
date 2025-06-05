import {
  PencilIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";



interface UpdateTermsOfUseProps {
  id: number;
  languageId?: number;
}

export function UpdateTermsOfUse({ id, languageId }: UpdateTermsOfUseProps) {
  const { t } = useTranslation();

  return (
    <Tooltip title={t("Edit")} arrow placement="top">
      <Link
        href={`/dashboard/termsOfUse/${id}/edit?languageId=${languageId}`}
        className="rounded-md border p-2 hover:bg-green-200"
      >
        <PencilIcon className="w-5" />
      </Link>
    </Tooltip>
  );
}

