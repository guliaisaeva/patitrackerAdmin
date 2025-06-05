import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { CONST } from "@/lib/const";
const token = process.env.NEXT_PUBLIC_API_TOKEN;

export const getAllAnnouncement = createAsyncThunk(
  "announcement/getAllAnnouncement",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.getAllAnnouncementURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to fetch pet types: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// export const getAnnouncementDetail = createAsyncThunk(
//   "announcement/getAnnouncementDetail",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `${CONST.getAnnouncementDetailURL}?announcementId=${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorDetail = await response.text();
//         throw new Error(
//           `Failed to fetch pet detail: ${response.statusText} - ${errorDetail}`
//         );
//       }

//       const data = await response.json();
//       return data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const getAnnouncementDetail = createAsyncThunk<
  AnnouncementDetail,
  { announcementId: number; languageId?: number }
>(
  "announcement/getAnnouncementDetail",
  async ({ announcementId, languageId }, { rejectWithValue }) => {
    try {
      const url = new URL(`${CONST.getAnnouncementDetailURL}`);
      url.searchParams.append("announcementId", announcementId.toString());
      if (languageId) {
        url.searchParams.append("languageId", languageId.toString());
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to fetch announcement detail: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      const announcementDetail = data.data[0]; // Assuming data.data is an array

      if (!announcementDetail || !announcementDetail.languages) {
        throw new Error("No announcement detail found");
      }

      // Ensure we only get the latest localized data for each languageId
      const latestLanguages: {
        [key: number]: { languageId: number; title: string; detail: string };
      } = {};
      announcementDetail.languages.forEach((localized: any) => {
        latestLanguages[localized.languageId] = localized;
      });

      // Convert the object back to an array
      announcementDetail.languages = Object.values(latestLanguages);
      return announcementDetail;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteAnnouncement = createAsyncThunk(
  "announcement/deleteAnnouncement",
  async (announcementId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${CONST.deleteAnnouncementURL}?announcementId=${announcementId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to delete announcement: ${response.statusText} - ${errorDetail}`
        );
      }

      return announcementId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAnnouncement = createAsyncThunk(
  "announcement/addAnnouncement",
  async (newAnnouncement: NewAnnouncement, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.addAnnouncementURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnnouncement),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to add announcement: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// export const updateAnnouncement = createAsyncThunk(
//   "announcement/updateAnnouncement",

//   async (updateAnnouncement: UpdateAnnouncement, { rejectWithValue }) => {
//     try {

//       const response = await fetch(CONST.updateAnnouncementURL, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updateAnnouncement),
//       });

//       if (!response.ok) {
//         const errorDetail = await response.text();
//         throw new Error(
//           `Failed to update pet type: ${response.statusText} - ${errorDetail}`
//         );
//       }

//       const data = await response.json();
//       return data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const updateAnnouncement = createAsyncThunk(
  "announcement/updateAnnouncement",
  async (updatedAnnouncement: UpdateAnnouncement, { rejectWithValue }) => {
    try {
      // Reduce to ensure unique localized entries based on languageId
      const uniqueLocalized = updatedAnnouncement.announcementsLocalized.reduce(
        (acc, curr) => {
          const existingIndex = acc.findIndex(
            (item) => item.languageId === curr.languageId
          );
          if (existingIndex === -1) {
            acc.push(curr);
          } else {
            acc[existingIndex] = curr; // Update existing entry if found
          }
          return acc;
        },
        [] as UpdateAnnouncement["announcementsLocalized"]
      );

      // Prepare the cleaned payload with unique localized announcements
      const cleanedPayload = {
        ...updatedAnnouncement,
        announcementsLocalized: uniqueLocalized,
      };

      // Send the POST request to update the announcement
      const response = await fetch(CONST.updateAnnouncementURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Make sure 'token' is defined in your context
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedPayload), // Use cleanedPayload
      });

      // Check if the response is not ok and throw an error
      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to update announcement: ${response.statusText} - ${errorDetail}`
        );
      }

      // Parse the response data
      const data = await response.json();
      return data.data; // Return the updated announcement data
    } catch (error: any) {
      return rejectWithValue(error.message); // Handle errors gracefully
    }
  }
);
export interface Announcement {
  id: number;
  title: string;
  detail: string;
  isRead: boolean;
}
interface AnnouncementDetail {
  title: string;
  detail: string;
  typeId: number;
  isRead: boolean;
  userProfileId: number;
  languages: { languageId: number; title: string; detail: string }[];
}
interface NewAnnouncement {
  title: string;
  detail: string;
  announcementTypeId: number;
  announcementsLocalized: {
    languageId: number;
    title: string;
    detail: string;
  }[];
}
export interface UpdateAnnouncement {
  id: number;
  title: string;
  detail: string;
  announcementsLocalized: {
    languageId: number;
    title: string;
    detail: string;
  }[];
}
interface AnnouncementSliceState {
  announcement: Announcement[];
  announcementDetail: AnnouncementDetail | null;

  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AnnouncementSliceState = {
  announcement: [],
  announcementDetail: null,
  loading: false,
  success: false,
  status: "idle",
  error: null,
};

export const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAnnouncement.fulfilled,
        (state, action: PayloadAction<Announcement[]>) => {
          state.status = "succeeded";
          state.announcement = action.payload;
        }
      )
      .addCase(getAllAnnouncement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(addAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addAnnouncement.fulfilled,
        (state, action: PayloadAction<Announcement>) => {
          state.status = "succeeded";
          state.announcement.push(action.payload);
          state.loading = false;
          state.success = true;
        }
      )
      .addCase(addAnnouncement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
        state.loading = false;
        state.success = false;
      })
      .addCase(updateAnnouncement.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        updateAnnouncement.fulfilled,
        (state, action: PayloadAction<UpdateAnnouncement | null>) => {
          state.status = "succeeded";

          if (!action.payload) {
            state.status = "failed";
            state.error = "Update payload is null";
            return;
          }

          // Check if action.payload.id is a valid number
          if (action.payload.id <= 0) {
            state.status = "failed";
            state.error = "Invalid announcement ID";
            return;
          }

          const index = state.announcement.findIndex(
            (announce) => announce?.id === action.payload?.id
          );

          if (index !== -1) {
            state.announcement[index] = {
              ...state.announcement[index],
              ...action.payload,
            };
          } else {
            state.status = "failed";
            state.error = "Announcement not found";
          }

          state.loading = false;
          state.success = true;
        }
      )
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.loading = false;
        state.success = false;
      })
      .addCase(getAnnouncementDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAnnouncementDetail.fulfilled,
        (state, action: PayloadAction<AnnouncementDetail>) => {
          state.loading = false;
          state.announcementDetail = action.payload;
        }
      )
      .addCase(getAnnouncementDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAnnouncement.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.announcement = state.announcement.filter(
            (announce) => announce.id !== action.payload
          );
          state.loading = false;
        }
      )
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const selectAnnouncements = (state: RootState) =>
  state.announcement.announcement;
export const selectAnnouncementDetail = (state: RootState) =>
  state.announcement.announcementDetail;
export const selectAnnouncementStatus = (state: RootState) =>
  state.announcement.status;
export const selectAnnouncementError = (state: RootState) =>
  state.announcement.error;

export default announcementSlice.reducer;
