import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import mealSliceReducer from './slices/mealSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    meal: mealSliceReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
