import { apiSlice } from './apiSlice';

export const mealsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMeal: builder.mutation({
      query: (mealData) => ({
        url: '/api/meals',
        method: 'POST',
        body: mealData,
      }),
      invalidatesTags: ['Meal', 'NutritionLog'],
    }),
    updateMeal: builder.mutation({
      query: ({ id, ...mealData }) => ({
        url: `/api/meals/${id}`,
        method: 'PUT',
        body: mealData,
      }),
      invalidatesTags: ['Meal', 'NutritionLog'],
    }),
    getNutritionLogs: builder.query({
      query: () => '/api/nutrition-logs',
      providesTags: (result = []) =>
        result.length
          ? [
              ...result.map((log) => ({
                type: 'NutritionLog',
                id: log.date, // or log._id if you prefer
              })),
              { type: 'NutritionLog', id: 'LIST' },
            ]
          : [{ type: 'NutritionLog', id: 'LIST' }],
    }),
    getNutritionLogByDate: builder.query({
      query: (date) => `/api/nutrition-logs/${date}`,
      providesTags: (result, error, date) => [
        { type: 'NutritionLog', id: date },
      ],
    }),
    getNutritionSuggestion: builder.query({
        query: () => '/api/suggestions/nutrition',
        keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useCreateMealMutation,
  useUpdateMealMutation,
  useGetNutritionLogsQuery,
  useGetNutritionLogByDateQuery,
  useGetNutritionSuggestionQuery,
} = mealsApiSlice;
