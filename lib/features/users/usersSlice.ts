import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { CONST } from "@/lib/const";

const token = process.env.NEXT_PUBLIC_API_TOKEN;

export const getUsers = async () => {
  const response = await fetch(CONST.getAllUserURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(
      `Failed to fetch users: ${response.statusText} - ${errorDetail}`
    );
  }

  const data = await response.json();
  return data.data;
};

export const getUsersAsync = createAsyncThunk("users/getUsers", async () => {
  const usersData = await getUsers();
  return usersData;
});

export const getUserById = async (userId: number) => {
  const response = await fetch(`${CONST.getUserDetailURL}?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(
      `Failed to fetch user: ${response.statusText} - ${errorDetail}`
    );
  }

  const data = await response.json();
  return data.data;
};
export const getUserByIdAsync = createAsyncThunk(
  "users/getUserById",
  async (userId: number) => {
    const userData = await getUserById(userId);
    return userData;
  }
);

export const searchUsers = async (searchWord: string) => {
  const response = await fetch(CONST.searchUserURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ searchWord }),
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(
      `Failed to search users: ${response.statusText} - ${errorDetail}`
    );
  }

  const data = await response.json();
  return data.data;
};

export const searchUsersAsync = createAsyncThunk(
  "users/searchUsers",
  async (searchWord: string) => {
    const searchData = await searchUsers(searchWord);
    return searchData;
  }
);

export const getSuperAdminDetail = async () => {
  const response = await fetch(CONST.getSuperAdminDetailURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetail = await response.text();
    throw new Error(
      `Failed to fetch superadmin details: ${response.statusText} - ${errorDetail}`
    );
  }

  const data = await response.json();
  return data.data;
};
export const getSuperAdminDetailAsync = createAsyncThunk(
  "superadmin/getSuperAdminDetail",
  async () => {
    const superadminData = await getSuperAdminDetail();
    return superadminData;
  }
);

interface User {
  userProfileId: number;
  profileImageUrl: string | null;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface UserSliceState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedUser: User | null;
  searchResults: User[];
  searchStatus: "idle" | "loading" | "succeeded" | "failed";
  searchError: string | null;
  userProfileId: number | null;
  superAdmin: User | null;
  superAdminStatus: "idle" | "loading" | "succeeded" | "failed";
  superAdminError: string | null;
}

const initialState: UserSliceState = {
  users: [],
  status: "idle",
  error: null,
  selectedUser: null,
  searchResults: [],
  searchStatus: "idle",
  searchError: null,
  userProfileId: null,
  superAdmin: null,
  superAdminStatus: "idle",
  superAdminError: null,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setUserProfileId: (state, action: PayloadAction<number>) => {
      state.userProfileId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(getUsersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(getUserByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedUser = action.payload;
        state.userProfileId = action.payload[0]?.userProfileId || null; // Example of setting userProfileId
      })
      .addCase(getUserByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(searchUsersAsync.pending, (state) => {
        state.searchStatus = "loading";
        state.searchResults = [];
        state.searchError = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.searchError = action.error.message ?? "Unknown error";
      })
      .addCase(getSuperAdminDetailAsync.pending, (state) => {
        state.superAdminStatus = "loading";
      })
      .addCase(getSuperAdminDetailAsync.fulfilled, (state, action) => {
        state.superAdminStatus = "succeeded";
        state.superAdmin = action.payload;
      })
      .addCase(getSuperAdminDetailAsync.rejected, (state, action) => {
        state.superAdminStatus = "failed";
        state.superAdminError = action.error.message ?? "Unknown error";
      });
  },
});

export const selectUsers = (state: RootState) => state.users.users;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectSelectedUser = (state: RootState) =>
  state.users.selectedUser;
export const selectSearchResults = (state: RootState) =>
  state.users.searchResults; // Selector for searchResults
export const selectSearchStatus = (state: RootState) =>
  state.users.searchStatus; // Selector for searchStatus
export const selectSearchError = (state: RootState) => state.users.searchError; // Selector for searchError
export const selectUserProfileId = (state: RootState) =>
  state.users.userProfileId;
export const selectSuperAdmin = (state: RootState) => state.users.superAdmin;

export const { clearSelectedUser, setUserProfileId } = userSlice.actions;

export default userSlice.reducer;
