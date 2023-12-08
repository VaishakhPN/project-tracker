import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategoryNames = createAsyncThunk('category/fetchCategoryNames', async () => {
  try {
    const response = await axios.get('http://localhost:8080/category/view');
    return response;
  } catch (error) {
    throw error;
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    allCategories: [],
    categories: [],
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryNames.fulfilled, (state, action) => {
        state.allCategories = action.payload.data;
        state.categories = action.payload.data;
        state.error = false;
      })
      .addCase(fetchCategoryNames.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default categorySlice.reducer;
