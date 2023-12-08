import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

 const createTask = createAsyncThunk('tasks/createTask', async (newTaskData) => {
    const response = await axios.post('http://localhost:8080/tickets/create', newTaskData);
    return response.data;
  });

  const tasksSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
      addTask: (state, action) => {
        state.push(action.payload);
      },
    },
    extraReducers: (builder) => {
      builder.addCase(createTask.fulfilled, (state, action) => {
        state.push(action.payload);
      })

    },
  });

  export { createTask };

  export const { addTask } = tasksSlice.actions;
  export default tasksSlice.reducer;