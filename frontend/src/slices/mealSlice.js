import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mealItems: localStorage.getItem('meal')
    ? JSON.parse(localStorage.getItem('meal')).mealItems || []
    : []
};
const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers:{
    addToMeal: (state, action) => {
      const item = action.payload;
      console.log(state);
      console.log(item);
        
      const existItem = state.mealItems.find((x) => x._id === item._id);
      if (existItem) {
        state.mealItems = state.mealItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.mealItems = [...state.mealItems, item];
      }
      localStorage.setItem('meal', JSON.stringify(state.mealItems));
    },
    removeFromMeal: (state, action) => {
      const item = action.payload;
      state.mealItems = state.mealItems.filter((x) => x._id !== item._id);
      localStorage.setItem('meal', JSON.stringify(state.mealItems));
    },
  },
});

export const { addToMeal, removeFromMeal } = mealSlice.actions;

export default mealSlice.reducer;