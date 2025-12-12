import { UserSession } from "@/types/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userSessionApi = createApi({
    reducerPath: 'userSessionApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-session'],

    refetchOnMountOrArgChange: true,

    endpoints: (builder) => ({
        getUserSession: builder.query<UserSession | null, void>({
            query: () => "user/session",
            providesTags: ['user-session']
        })
    })
})

export const { useGetUserSessionQuery } = userSessionApi