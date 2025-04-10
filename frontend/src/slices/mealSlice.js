import { createSlice } from '@reduxjs/toolkit';
import { updateMeal } from '../utils/mealUtils';

const initialState = localStorage.getItem('meal')
  ? JSON.parse(localStorage.getItem('meal'))
  : { mealItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    addToMeal: (state, action) => {
      // NOTE: we don't need user, rating, numReviews or reviews
      // in the Meal
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const existItem = state.mealItems.find((x) => x._id === item._id);

      if (existItem) {
        state.mealItems = state.mealItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.mealItems = [...state.mealItems, item];
      }

      return updateMeal(state, item);
    },
    removeFromMeal: (state, action) => {
      state.mealItems = state.mealItems.filter((x) => x._id !== action.payload);
      return updateMeal(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('meal', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('meal', JSON.stringify(state));
    },
    clearMealItems: (state, action) => {
      state.mealItems = [];
      localStorage.setItem('meal', JSON.stringify(state));
    },
    // NOTE: here we need to reset state for when a user logs out so the next
    // user doesn't inherit the previous users Meal and
    resetMeal: (state) => (state = initialState),
  },
});

export const {
  addToMeal,
  removeFromMeal,
  saveShippingAddress,
  savePaymentMethod,
  clearMealItems,
  resetMeal,
} = mealSlice.actions;

export default mealSlice.reducer;
