import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { CONST } from "@/lib/const";

const token = process.env.NEXT_PUBLIC_API_TOKEN;

export const getAllPetTypes = createAsyncThunk(
  "pets/getAllPetTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.getAllPetTypeURL, {
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

export const getPetDetail = createAsyncThunk(
  "pets/getPetDetail",
  async (petTypeId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${CONST.getPetTypeDetailURL}?petTypeId=${petTypeId}`,
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
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPetType = createAsyncThunk(
  "pets/addPetType",
  async (newPetType: AddPetType, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.addPetTypeURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([newPetType]),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to add pet type: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLanguages = createAsyncThunk(
  "languages/fetchLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.getLanguagesURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to fetch languages: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePetType = createAsyncThunk(
  "petTypes/deletePetType",
  async (petTypeId: number, { rejectWithValue }) => {
    const response = await fetch(
      `${CONST.deletePetTypeURL}?petTypeId=${petTypeId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(
        `Failed to delete Pet Types: ${response.statusText} - ${errorDetail}`
      );
    }
    return petTypeId;
  }
);

export const updatePetType = createAsyncThunk(
  "petTypes/updatePetType",
  async (updatedPetType: UpdatePetType, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.updatePetTypeURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPetType),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to update pet type: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export interface PetType {
  typeId: number;
  typeName: string;
  languageId: number;
}
interface PetDetail {
  typeId: number;
  typeName: string;
  languageId: number;
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

export interface UpdatePetType {
  petTypeId: number;
  languageId: number;
  petType: string;
}

interface PetTypeSliceState {
  petTypes: PetType[];
  petDetail: PetDetail | null;
  addPetType: AddPetType[];
  languages: Language[];
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
  success: boolean;
  simCardAdd: AddPetType[];
}

const initialState: PetTypeSliceState = {
  petTypes: [],
  petDetail: null,
  simCardAdd: [],
  addPetType: [],
  languages: [],
  loading: false,
  success: false,
  status: "idle",
  error: null,
};

export const petTypeSlice = createSlice({
  name: "petTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPetTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllPetTypes.fulfilled,
        (state, action: PayloadAction<PetType[]>) => {
          state.loading = false;
          state.petTypes = action.payload;
        }
      )
      .addCase(getAllPetTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getPetDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPetDetail.fulfilled,
        (state, action: PayloadAction<PetDetail>) => {
          state.loading = false;
          state.petDetail = action.payload;
        }
      )
      .addCase(getPetDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addPetType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        addPetType.fulfilled,
        (state, action: PayloadAction<AddPetType>) => {
          state.loading = false;
          state.addPetType.push(action.payload);
          state.success = true;
        }
      )
      .addCase(addPetType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLanguages.fulfilled,
        (state, action: PayloadAction<Language[]>) => {
          state.loading = false;
          state.languages = action.payload;
        }
      )
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deletePetType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deletePetType.fulfilled,
        (state, action: PayloadAction<number | string>) => {
          state.loading = true;
          state.petTypes = state.petTypes.filter(
            (petType) => petType.typeId !== action.payload
          );
          state.loading = false;
        }
      )

      .addCase(deletePetType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(updatePetType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updatePetType.fulfilled,
        (state, action: PayloadAction<PetType | null>) => {
          state.status = "succeeded";
          if (action.payload) {
            const index = state.petTypes.findIndex(
              (petType) => petType.typeId === action.payload?.typeId
            );
            if (index !== -1) {
              state.petTypes[index] = action.payload;
            }
          }
        }
      )
      .addCase(updatePetType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectPetTypes = (state: RootState) => state.petTypes.petTypes;
export const selectPetTypesStatus = (state: RootState) => state.petTypes.status;
export const selectPetTypesError = (state: RootState) => state.petTypes.error;
export const selectLoading = (state: RootState) => state.petTypes.loading;
export const selectPetDetail = (state: RootState) => state.petTypes.petDetail;
export const selectAddPetType = (state: RootState) => state.petTypes.addPetType;
export const selectLanguages = (state: RootState) => state.petTypes.languages;

export const {} = petTypeSlice.actions;

export default petTypeSlice.reducer;
