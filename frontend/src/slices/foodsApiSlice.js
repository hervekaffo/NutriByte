import { FOODS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const foodsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: FOODS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Foods'],
    }),
    getFoodDetails: builder.query({
      query: (foodId) => ({
        url: `${FOODS_URL}/${foodId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createFood: builder.mutation({
      query: () => ({
        url: `${FOODS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Food'],
    }),
    updateFood: builder.mutation({
      query: (data) => ({
        url: `${FOODS_URL}/${data.foodId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Foods'],
    }),
    uploadFoodImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteFood: builder.mutation({
      query: (foodId) => ({
        url: `${FOODS_URL}/${foodId}`,
        method: 'DELETE',
      }),
      providesTags: ['Food'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${FOODS_URL}/${data.foodId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Food'],
    }),
    // Top rated foods endpoint
    getTopFoods: builder.query({
      query: () => `${FOODS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetFoodsQuery,
  useGetFoodDetailsQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useUploadFoodImageMutation,
  useDeleteFoodMutation,
  useCreateReviewMutation,
  useGetTopFoodsQuery,
} = foodsApiSlice;
