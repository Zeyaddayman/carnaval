import { UserSession } from "@/types/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserSessionApi = createApi({
    reducerPath: 'UserSessionApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/auth/'}),
    tagTypes: ['user-session'],

    endpoints: (builder) => ({
        getUserSession: builder.query({
            query: () => "session",
            providesTags: ['user-session']
        })
    })
})

export const { useGetUserSessionQuery } = UserSessionApi