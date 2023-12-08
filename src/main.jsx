import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import tasksReducer from './slices/tasksSlices';
import './index.css';
import ticketSlices from './slices/ticketSlices';
import categoryReducer from './slices/categorySlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ticket: ticketSlices,
    category: categoryReducer,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
