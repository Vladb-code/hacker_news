import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

const NEWS_LIMIT = 100;
const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

export const fetchAssets = createAsyncThunk(
  "news/fetchAssets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("newstories.json");
      const ids = response.data.slice(0, NEWS_LIMIT);

      const itemPromises = ids.map((id) =>
        axiosInstance.get(`item/${id}.json`),
      );
      const results = await Promise.allSettled(itemPromises);

      return results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value.data)
        .filter((item) => item !== null)
        .sort((a, b) => b.time - a.time);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const newsSlice = createSlice({
  name: "news",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const selectNewsState = (state) => state.news;

export const selectAllNews = createSelector(
  [selectNewsState],
  (news) => news.items,
);

export const selectNewsLoading = createSelector(
  [selectNewsState],
  (news) => news.loading,
);

export const selectNewsError = createSelector(
  [selectNewsState],
  (news) => news.error,
);

export const selectNewsById = (id) =>
  createSelector([selectAllNews], (items) =>
    items?.find((item) => item.id === parseInt(id)),
  );

export default newsSlice.reducer;
