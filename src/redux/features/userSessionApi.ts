import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userSessionApi = createApi({
    reducerPath: 'userSessionApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-session'],

    endpoints: (builder) => ({
        getUserSession: builder.query({
            query: () => "user/session",
            providesTags: ['user-session']
        })
    })
})

export const { useGetUserSessionQuery } = userSessionApi