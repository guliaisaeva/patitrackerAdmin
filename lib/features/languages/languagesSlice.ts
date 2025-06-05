import { CONST } from "@/lib/const";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const token = process.env.NEXT_PUBLIC_API_TOKEN;

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
export interface Language {
  languageId: number;
  languageName: string;
  languageAbbreviation: string;
}
interface LanguageState {
  language: string;
  languages: Language[];
  loading: boolean;
  error: string | null;
}

const initialState: LanguageState = {
  language: "tr",
  languages: [],
  loading: false,
  error: null,
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLanguages.fulfilled,
        (state, action: PayloadAction<Language[]>) => {
          state.languages = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLanguage } = languageSlice.actions;
export const selectLanguages = (state: { language: LanguageState }) =>
  state.language.languages;
export const selectCurrentLanguage = (state: { language: LanguageState }) =>
  state.language.language;
export default languageSlice.reducer;
