import { CardProduct } from "@/types/products";
import { WishlistItem } from "@/types/wishlist";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserWishlistResponse {
    message: string
}

export const userWishlistApi = createApi({
    reducerPath: 'userWishlistApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-wishlist'],

    endpoints: (builder) => ({
        getUserWishlist: builder.query<{ items: WishlistItem[] }, string>({
            query: () => "user/wishlist",

            providesTags: ['user-wishlist']
        }),

        addItemToUserWishlist: builder.mutation<Response, { product: CardProduct, userId: string } >({
            query: ({ product }) => ({
                url: "user/wishlist",
                method: 'POST',
                body: { productId: product.id }
            }),

            transformErrorResponse: (error: any): UserWishlistResponse => {
                return {
                    message: error.data ? error.data.message : 'Something went wrong'
                }
            },

            async onQueryStarted({ product, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userWishlistApi.util.updateQueryData('getUserWishlist', userId, (draft: { items: WishlistItem[] }) => {

                        const existingItem = draft.items.find(item => item.productId === product.id)

                        if (existingItem) return
                        else {

                            const tempItem: WishlistItem = {
                                id: crypto.randomUUID(),
                                userId,
                                productId: product.id,
                                product: product,
                                createdAt: new Date()
                            }

                            const serializableTempItem = JSON.parse(JSON.stringify(tempItem))

                            draft.items.push(serializableTempItem)
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

        removeItemFromUserWishlist: builder.mutation<Response, { productId: string, userId: string } >({
            query: ({ productId }) => ({
                url: "user/wishlist",
                method: 'DELETE',
                body: { productId }
            }),

            transformErrorResponse: (error: any): UserWishlistResponse => {
                return {
                    message: error.data ? error.data.message : 'Something went wrong'
                }
            },

            async onQueryStarted({ productId, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userWishlistApi.util.updateQueryData('getUserWishlist', userId, (draft: { items: WishlistItem[] }) => {

                        draft.items = draft.items.filter(item => item.productId !== productId)
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