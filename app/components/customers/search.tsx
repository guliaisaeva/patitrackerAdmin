"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  searchUsersAsync,
  selectSearchResults,
  selectSearchStatus,
  selectSearchError,
} from "@/lib/features/users/usersSlice";
import { useState } from "react";
import { t } from "i18next";

export default function Search({ placeholder }: { placeholder: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const searchResults = useSelector(selectSearchResults);
  const searchStatus = useSelector(selectSearchStatus);
  const searchError = useSelector(selectSearchError);

  const [searchTerm, setSearchTerm] = useState("");

  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term); // Update local state with current search term
    if (term.trim() !== "") {
      dispatch(searchUsersAsync(term)); // Dispatch searchUsersAsync action with the search term
    }
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        {t("user.search")}
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
