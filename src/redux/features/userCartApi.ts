import { Cart, CartItem } from "@/generated/prisma";
import { CartItemWithProduct } from "@/types/cart";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserCartApi = createApi({
    reducerPath: 'UserCartApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/cart/'}),
    tagTypes: ['user-cart'],

    endpoints: (builder) => ({
        getUserCart: builder.query<Cart & { items: CartItemWithProduct[] }, string>({
            query: (userId: string) => `${userId}`,
            providesTags: ['user-cart']
        }),
        addItemToUserCart: builder.mutation< Cart & { items: CartItemWithProduct[] }, { userId: string, cartItem: Omit<CartItem, "id"> } >({
            query: ({ userId, cartItem }) => ({
                url: `${userId}`,
                method: 'POST',
                body: cartItem
            }),
            invalidatesTags: ['user-cart']
        }),
        updateItemQtyInUserCart: builder.mutation< Cart & { items: CartItemWithProduct[] }, { userId: string, cartItem: Pick<CartItem, "id" | "quantity"> } >({
            query: ({ userId, cartItem }) => ({
                url: `${userId}`,
                method: 'PUT',
                body: cartItem
            }),
            invalidatesTags: ['user-cart']
        }),
        removeItemFromUserCart: builder.mutation< Cart & { items: CartItemWithProduct[] }, { userId: string, cartItem: Pick<CartItem, "id"> } >({
            query: ({ userId, cartItem }) => ({
                url: `${userId}`,
                method: 'DELETE',
                body: cartItem
            }),
            invalidatesTags: ['user-cart']
        }),
    })
})

export const {
    useGetUserCartQuery,
    useAddItemToUserCartMutation,
    useUpdateItemQtyInUserCartMutation,
    useRemoveItemFromUserCartMutation

} = UserCartApi