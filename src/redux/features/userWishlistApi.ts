import { wishlistItemWithProduct } from "@/types/wishlist";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AddWishlistItemResponse, RemoveWishlistItemResponse, WishlistError, WishlistResponse } from "../types/wishlist-response";


export const userWishlistApi = createApi({
    reducerPath: 'userWishlistApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-wishlist'],

    refetchOnMountOrArgChange: true,

    endpoints: (builder) => ({
        getUserWishlist: builder.query<WishlistResponse, string>({
            query: () => "user/wishlist",

            providesTags: ['user-wishlist']
        }),

        addItemToUserWishlist: builder.mutation<AddWishlistItemResponse, { product: wishlistItemWithProduct["product"], userId: string } >({
            query: ({ product }) => ({
                url: "user/wishlist",
                method: 'POST',
                body: { productId: product.id }
            }),

            transformErrorResponse: (error: any): WishlistError => {
                return {
                    message: error.data ? error.data.message : 'Something went wrong',
                    status: error.data ? error.status : 500
                }
            },

            async onQueryStarted({ product, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userWishlistApi.util.updateQueryData('getUserWishlist', userId, (draft: { items: wishlistItemWithProduct[] }) => {

                        const existingItem = draft.items.find(item => item.product.id === product.id)

                        if (existingItem) return
                        else {

                            const tempItem: wishlistItemWithProduct = { product }

                            draft.items.push(tempItem)
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },

            invalidatesTags: ['user-wishlist']

        }),

        removeItemFromUserWishlist: builder.mutation<RemoveWishlistItemResponse, { productId: string, userId: string } >({
            query: ({ productId }) => ({
                url: "user/wishlist",
                method: 'DELETE',
                body: { productId }
            }),

            transformErrorResponse: (error: any): WishlistError => {
                return {
                    message: error.data ? error.data.message : 'Something went wrong',
                    status: error.data ? error.status : 500
                }
            },

            async onQueryStarted({ productId, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userWishlistApi.util.updateQueryData('getUserWishlist', userId, (draft: WishlistResponse) => {

                        draft.items = draft.items.filter(item => item.product.id !== productId)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },

            invalidatesTags: ['user-wishlist']
        })
    })
})

export const {
    useGetUserWishlistQuery,
    useAddItemToUserWishlistMutation,
    useRemoveItemFromUserWishlistMutation

} = userWishlistApi