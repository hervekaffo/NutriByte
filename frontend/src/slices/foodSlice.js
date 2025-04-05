import { FOODS_URL } from "../constants";
import { apiSlice } from "./apiSclice.js";

export const foodSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query({
      query: () => ({
      url: FOODS_URL,
       }),
       keepUnusedDataFor: 5,
    }),
    
    getFoodDetails: builder.query({
        query: (foodId) => ({
          url: `${FOODS_URL}/${foodId}`,
        }),
        keepUnusedDataFor: 5,
      }),
    }),
  });

export const {
  useGetFoodsQuery,
  useGetFoodDetailsQuery
} = foodSlice;