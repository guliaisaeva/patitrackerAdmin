import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { CONST } from "@/lib/const";
import DOMPurify from "dompurify";

const token = process.env.NEXT_PUBLIC_API_TOKEN;

export interface TermsOfUse {
  id: number;
  title: string;
  detail: string;
  languageId: number;
}
export interface PrivacyPolicy {
  id: number;
  title: string;
  detail: string;
  mobileLanguageId: number;
}

interface PrivacyPolicyState {
  terms: TermsOfUse[];
  privacyPolicy: PrivacyPolicy[];
  loading: boolean;
  error: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: PrivacyPolicyState = {
  terms: [],
  privacyPolicy: [],
  loading: false,
  error: null,
  status: "idle",
};

export const fetchTermsOfUse = createAsyncThunk(
  "termsOfUse/fetchTermsOfUse",
  async (languageId: number | undefined, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.getAllTermsOfUse, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        console.error("Backend Error Response:", errorDetail);
        return rejectWithValue(
          `Failed to update terms of use: ${
            errorDetail.message || response.statusText
          }`
        );
      }

      const data = await response.json();

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchPrivacyPolicy = createAsyncThunk(
  "privacyPolicy/fetchPrivacyPolicy",
  async (languageId: number | undefined, { rejectWithValue }) => {
    try {
      const response = await fetch(CONST.getAllPrivacyPolicy, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        console.error("Backend Error Response:", errorDetail);
        return rejectWithValue(
          `Failed to update terms of use: ${
            errorDetail.message || response.statusText
          }`
        );
      }

      const data = await response.json();

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTermsOfUse = createAsyncThunk(
  "termsOfUse/updateTermsOfUse",
  async (termsOfUse: TermsOfUse, { rejectWithValue }) => {
    try {
      const sanitizedTermsOfUse = {
        ...termsOfUse,
        title: DOMPurify.sanitize(termsOfUse.title, {
          ALLOWED_TAGS: ["h2", "strong", "u", "em", "a"],
          ALLOWED_ATTR: ["href", "rel", "target"],
        }),
        detail: DOMPurify.sanitize(termsOfUse.detail, {
          ALLOWED_TAGS: ["p", "strong", "u", "em", "a", "ul", "ol", "li"],
          ALLOWED_ATTR: ["href", "rel", "target"],
        }),
      };

      const response = await fetch(CONST.updateTermsOfUse, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([sanitizedTermsOfUse]),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to update terms of use: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      console.log("Updated data:", data);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const updatePrivacyPolicy = createAsyncThunk(
  "privacyPolicy/updatePrivacyPolicy",
  async (privacyPolicy: PrivacyPolicy, { rejectWithValue }) => {
    try {
      const sanitizedTermsOfUse = {
        ...privacyPolicy,
        title: DOMPurify.sanitize(privacyPolicy.title, {
          ALLOWED_TAGS: ["h2", "strong", "u", "em", "a"],
          ALLOWED_ATTR: ["href", "rel", "target"],
        }),
        detail: DOMPurify.sanitize(privacyPolicy.detail, {
          ALLOWED_TAGS: ["p", "strong", "u", "em", "a", "ul", "ol", "li"],
          ALLOWED_ATTR: ["href", "rel", "target"],
        }),
      };

      const response = await fetch(CONST.updatePrivacyPolicy, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([sanitizedTermsOfUse]),
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(
          `Failed to update terms of use: ${response.statusText} - ${errorDetail}`
        );
      }

      const data = await response.json();
      console.log("Updated data:", data);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const termsPrivacySlice = createSlice({
  name: "termsPrivacy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTermsOfUse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTermsOfUse.fulfilled,
        (state, action: PayloadAction<TermsOfUse[]>) => {
          state.terms = action.payload;
          state.loading = false;
          state.status = "succeeded";
        }
      )
      .addCase(
        fetchPrivacyPolicy.fulfilled,
        (state, action: PayloadAction<PrivacyPolicy[]>) => {
          state.privacyPolicy = action.payload;
          state.loading = false;
          state.status = "succeeded";
        }
      )
      .addCase(fetchTermsOfUse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateTermsOfUse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateTermsOfUse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && Array.isArray(action.payload)) {
          action.payload.forEach((updatedTerm) => {
            const index = state.terms.findIndex(
              (term) => term.id === updatedTerm.id
            );
            if (index !== -1) {
              state.terms[index] = updatedTerm;
            }
          });
        }
      })
      .addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && Array.isArray(action.payload)) {
          action.payload.forEach((updatedTerm) => {
            const index = state.terms.findIndex(
              (term) => term.id === updatedTerm.id
            );
            if (index !== -1) {
              state.terms[index] = updatedTerm;
            }
          });
        }
      })
      .addCase(updateTermsOfUse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectTermsOfUseByLanguage = createSelector(
  (state: RootState) => state.termsPrivacy.terms,
  (state: RootState, languageId: number) => languageId,
  (terms, languageId) => terms.filter((term) => term.languageId === languageId)
);
export const selectPrivacyPoliciesByLanguage = createSelector(
  (state: RootState) => state.termsPrivacy.privacyPolicy,
  (state: RootState, mobileLanguageId: number) => mobileLanguageId,
  (privacyPolicy, mobileLanguageId) =>
    privacyPolicy.filter(
      (privacy) => privacy.mobileLanguageId === mobileLanguageId
    )
);

export const selectAllTerms = (state: RootState) => state.termsPrivacy.terms;
export const selectAllPrivacyPolicy = (state: RootState) =>
  state.termsPrivacy.privacyPolicy;
export const selectLoading = (state: { privacyPolicy: PrivacyPolicyState }) =>
  state?.privacyPolicy?.loading;
export const selectError = (state: { privacyPolicy: PrivacyPolicyState }) =>
  state?.privacyPolicy?.error;
export default termsPrivacySlice.reducer;
