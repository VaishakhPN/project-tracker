import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [] },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
  },
});

export const { addTask, removeTask } = tasksSlice.actions;
export const selectTasks = state => state.tasks.tasks;
export default tasksSlice.reducer;

