
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const deleteTask = createAsyncThunk('ticket/deleteTask', async (id) => {
  await axios.delete(`http://localhost:8080/tickets/${id}`);
  return id;
});

export const updateTask = createAsyncThunk('ticket/updateTask', async ({ id, updatedTask }) => {
  console.log(updatedTask)
  const response = await axios.put(`http://localhost:8080/tickets/${id}`, updatedTask);
  return response.data;
});
export const fetchDataByCategory = createAsyncThunk(
  'ticket/fetchDataByCategory',
  async (category, { rejectWithValue }) => {
    try {
      let response;

      if (category === 'All') {
        response = await axios.get(`http://localhost:8080/tickets/search?query=&page=0&size=5&sort=id,asc`);
        return response.data.content;

      } else {
        response = await axios.get(`http://localhost:8080/tickets/categories/name/${category}`);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchTaskData = createAsyncThunk('ticket/fetchTaskData', async ({ search, pageNumber }) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/tickets/search?query=${search}&page=${pageNumber}&size=5&sort=id,asc`
    );

    return response.data.content;

  } catch (error) {
    throw error;
  }
});

const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    taskData: [],
    searchResults: [],
    selectedTask: null,
    data:[],
    error: false,
  },
  reducers: { setSelectedTask: (state, action) => {
    state.selectedTask = action.payload;
  },},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskData.fulfilled, (state, action) => {
        state.taskData = action.payload;
        state.data = action.payload;
        console.log(action.payload)
        state.searchResults = action.payload;
        state.selectedTask = action.payload.length > 0 ? action.payload[0] : null;
        state.error = false;
      })
      .addCase(fetchTaskData.rejected, (state, action) => {
        state.error = true;
      }) .addCase(fetchDataByCategory.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = false;
      })
      .addCase(fetchDataByCategory.rejected, (state, action) => {
        state.error = true;

      })      
      .addCase(updateTask.fulfilled, (state, action) => {
          state.selectedTask = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {

        state.data = state.data.filter((task) => task.ticketId !== action.payload);
      })
  },
});
export const { setSelectedTask } = ticketSlice.actions;

export default ticketSlice.reducer;
