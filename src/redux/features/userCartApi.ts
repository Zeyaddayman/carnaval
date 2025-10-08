import { CartWithItems } from "@/types/cart";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserCartApi = createApi({
    reducerPath: 'UserCartApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-cart'],

    endpoints: (builder) => ({
        getUserCart: builder.query<CartWithItems, void>({
            query: () => "cart",
            providesTags: ['user-cart']
        }),
        addItemToUserCart: builder.mutation<CartWithItems, { productId: string, quantity: number } >({
            query: ({ productId, quantity }) => ({
                url: "cart",
                method: 'POST',
                body: { productId, quantity }
            }),
            invalidatesTags: ['user-cart']
        }),
        removeItemFromUserCart: builder.mutation<CartWithItems, string >({
            query: (productId) => ({
                url: "cart",
                method: 'DELETE',
                body: { productId }
            }),
            invalidatesTags: ['user-cart']
        }),
    })
})

export const {
    useGetUserCartQuery,
    useAddItemToUserCartMutation,
    useRemoveItemFromUserCartMutation

} = UserCartApi