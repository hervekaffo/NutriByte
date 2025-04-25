import { apiSlice } from './apiSlice';

export const goalsApiSlice = apiSlice.injectEndpoints({
  tagTypes: ['Goal'],
  endpoints: (builder) => ({
    getMyGoal: builder.query({
      query: () => '/api/goals/my',
      providesTags: ['Goal']
    }),
    createGoal: builder.mutation({
      query: (data) => ({
        url: '/api/goals',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Goal']
    }),
    updateGoal: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/goals/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Goal']
    }),
    getGoals: builder.query({
      query: () => '/api/goals',
      providesTags: ['Goal']
    }),
    deleteGoal: builder.mutation({
      query: (id) => ({
        url: `/api/goals/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Goal']
    }),
    getGoalById: builder.query({
      query: (id) => `/api/goals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Goal', id }]
    })
  })
});

export const {
  useGetMyGoalQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useGetGoalsQuery,
  useDeleteGoalMutation,
  useGetGoalByIdQuery
} = goalsApiSlice;
