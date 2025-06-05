import {
  InformationCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { deleteAnnouncement } from "@/lib/features/announcement/announceSlice";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

export function CreateAnnouncement() {
  const { t } = useTranslation();
  return (
    <Link
      href="/dashboard/announcements/create"
      className="flex h-10 items-center rounded-lg bg-orange-600 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      <span className="hidden md:block">{t("announcement.create")}</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export function AnnouncementInfo({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/announcements/${id}/info`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <InformationCircleIcon className="w-5" />
    </Link>
  );
}

export function UpdateAnnouncement({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/announcements/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteAnnouncement({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(deleteAnnouncement(id)).unwrap();
      alert(t("announcement.messages.deleteSuccess"));
    } catch (error) {
      alert(t("announcement.messages.deleteFailure"));
      console.error("Delete Announcement Error:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <button className="rounded-md border p-2 hover:bg-green-100  hover:text-black">
        <span className="sr-only">{t("delete")}</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
