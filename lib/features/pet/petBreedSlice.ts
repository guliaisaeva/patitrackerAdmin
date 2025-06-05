import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { CONST } from "@/lib/const";

const token = process.env.NEXT_PUBLIC_API_TOKEN;

export const getAllPetBreeds = createAsyncThunk(
  "pets/getAllPetBreeds",
  async (
    { petTypeId, languageId }: { petTypeId: string; languageId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${CONST.getAllPetBreedURL}?petTypeId=${petTypeId}&languageId=${languageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to fetch pet breeds: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPetBreedDetail = createAsyncThunk(
  "pets/getPetBreedDetail",
  async (petBreedId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${CONST.getPetBreedDetailURL}?petBreedId=${petBreedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to fetch pet detail: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();

      const latestLanguages: { [key: number]: { id: number; text: string } } =
        {};
      data.data.languages.forEach((language: { id: number; text: string }) => {
        latestLanguages[language.id] = language; // Overwrite duplicate ids with the latest entry
      });

      data.data.languages = Object.values(latestLanguages);
      console.log(data);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const addPetBreed = createAsyncThunk(
  "petBreeds/addPetBreed",
  async (newPetBreed: PetBreedRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.addPetBreedURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPetBreed),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to add pet breed: ${response.statusText} - ${errorDetail}`
        );
      }
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePetBreed = createAsyncThunk(
  "petBreeds/updatePetBreed",
  async (updatedPetBreed: PetBreedUpdate, { rejectWithValue, dispatch }) => {
    try {
      const uniqueBreedsLocalized = updatedPetBreed.petBreedsLocalized.reduce(
        (acc, curr) => {
          const existingIndex = acc.findIndex(
            (item) => item.languageId === curr.languageId
          );
          if (existingIndex === -1) {
            acc.push(curr);
          } else {
            acc[existingIndex] = curr;
          }
          return acc;
        },
        [] as PetBreedUpdate["petBreedsLocalized"]
      );

      const cleanedPayload = {
        ...updatedPetBreed,
        petBreedsLocalized: uniqueBreedsLocalized,
      };

      console.log("Cleaned Payload:", cleanedPayload);

      const response = await fetch(CONST.updatePetBreedURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedPayload),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to update pet breed: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      console.log("Response Data:", data.data);

      if (data && data.data) {
        return data.data;
      } else {
        console.warn("No data returned. Fetching breed details...");

        const breedDetailResponse = await dispatch(
          getPetBreedDetail(updatedPetBreed.breedId ?? 0)
        ).unwrap();

        if (breedDetailResponse) {
          return breedDetailResponse;
        } else {
          throw new Error("Failed to fetch breed details after update.");
        }
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePetBreed = createAsyncThunk(
  "petBreed/deletePetBreed",
  async (petBreedId: number, { rejectWithValue }) => {
    const response = await fetch(
      `${CONST.deletePetBreedURL}?petId=${petBreedId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(
        `Failed to delete Pet Breed: ${response.statusText} - ${errorDetail}`
      );
    }
    return petBreedId;
  }
);

export const searchPetBreeds = createAsyncThunk<
  PetBreedResponse, // Return type of the thunk
  {
    petTypeId: number;
    searchWord: string;
    languageId: number;
  },
  { rejectValue: string } // Error type
>("petBreeds/searchPetBreeds", async (searchParams, { rejectWithValue }) => {
  try {
    const response = await fetch(`${CONST.searchPetBreedURL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Ensure you have `token` available
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(
        `Failed to search pet breeds: ${response.statusText} - ${errorDetail}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface PetBreed {
  breedId?: number | null;
  petTypeId: number | null;
  languageId: number;
  breedName: string;
}
export interface PetBreedResponse {
  petBreeds: PetBreed[];
  totalCount: number;
}
interface PetBreedDetail {
  breedId: number | null;
  petTypeId: number | null;
  breedName: string;
  languages: {
    id: number;
    text: string;
  }[];
}
export interface PetBreedRequest {
  petTypeId: number | null;
  breedName: string;
  petBreedsLocalized: {
    languageId: number;
    breedName: string;
  }[];
}
interface PetBreedUpdate {
  breedId: number | null;
  petTypeId: number | null;
  breedName: string;
  petBreedsLocalized: {
    languageId: number;
    breedName: string;
  }[];
}
export interface AddPetType {
  petType: string;
  languageId: number;
}

interface Language {
  languageId: number;
  languageName: string;
  languageAbbreviation: string;
}

interface PetBreedSliceState {
  petBreeds: PetBreed[];
  addPetType: AddPetType[];
  PetBreedRequest: PetBreedRequest[];
  breedDetail: PetBreedDetail | null;
  languages: Language[];
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
  success: boolean;
  simCardAdd: AddPetType[];
  PetBreedUpdate: PetBreedUpdate[];
  totalCount: number;
}

const initialState: PetBreedSliceState = {
  petBreeds: [],
  simCardAdd: [],
  addPetType: [],
  PetBreedRequest: [],
  breedDetail: null,
  languages: [],
  loading: false,
  success: false,
  status: "idle",
  error: null,
  PetBreedUpdate: [],
  totalCount: 0,
};

export const petBreedSlice = createSlice({
  name: "petBreeds",
  initialState,
  reducers: {
    resetSearchResults(state) {
      state.petBreeds = [];
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPetBreeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllPetBreeds.fulfilled,
        (state, action: PayloadAction<PetBreed[]>) => {
          state.loading = false;
          state.petBreeds = action.payload;
        }
      )
      .addCase(getAllPetBreeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addPetBreed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPetBreed.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.petBreeds.push(action.payload);
      })
      .addCase(addPetBreed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(updatePetBreed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePetBreed.fulfilled,
        (state, action: PayloadAction<PetBreedUpdate | null>) => {
          state.loading = false;
          if (action.payload) {
            state.petBreeds = state.petBreeds.map((breed) =>
              breed?.breedId === action.payload?.breedId
                ? { ...breed, ...action.payload }
                : breed
            );
          } else {
            console.log("Action payload:", action.payload);
            console.error("Update successful but no data returned.");
          }
        }
      )
      .addCase(updatePetBreed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(
        getPetBreedDetail.fulfilled,
        (state, action: PayloadAction<PetBreedDetail>) => {
          state.loading = false;
          state.breedDetail = action.payload;
        }
      )
      .addCase(getPetBreedDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePetBreed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deletePetBreed.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.petBreeds = state.petBreeds.filter(
            (petBreed) => petBreed.breedId !== action.payload
          );
        }
      )
      .addCase(deletePetBreed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(searchPetBreeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchPetBreeds.fulfilled,
        (state, action: PayloadAction<PetBreedResponse>) => {
          state.loading = false;
          state.petBreeds = action.payload.petBreeds;
          state.totalCount = action.payload.totalCount;
        }
      )
      .addCase(searchPetBreeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectPetBreeds = (state: RootState) => state.petBreeds.petBreeds;
export const selectLoading = (state: RootState) => state.petBreeds.loading;
export const selectSuccess = (state: RootState) => state.petBreeds.success;
export const selectTotalCount = (state: RootState) =>
  state.petBreeds.totalCount;
export const selectBreedDetail = (state: RootState) =>
  state.petBreeds.breedDetail;

export const selectPetBreedsByPetType = createSelector(
  [selectPetBreeds, (_, petTypeId: number) => petTypeId],
  (petBreeds, petTypeId) =>
    petBreeds.filter((breed) => breed.petTypeId === petTypeId)
);

export const { resetSearchResults } = petBreedSlice.actions;

export default petBreedSlice.reducer;
