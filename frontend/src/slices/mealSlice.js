import { createSlice } from '@reduxjs/toolkit';

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
    },
    removeFromMeal: (state, action) => {
      state.mealItems = state.mealItems.filter((x) => x._id !== action.payload);
    },
    clearMealItems: (state, action) => {
      state.mealItems = [];
      localStorage.setItem('meal', JSON.stringify(state));
    },
    // NOTE: here we need to reset state for when a user logs out so the next
    // user doesn't inherit the previous users Meal and
    resetMeal: () => initialState,
  },
});

export const {
  addToMeal,
  removeFromMeal,
  clearMealItems,
  resetMeal,
} = mealSlice.actions;

export default mealSlice.reducer;
