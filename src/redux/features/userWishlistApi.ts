import { WishlistItem } from "@/types/wishlist";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Response {
    message: string
    status: number
}

export interface WishlistErrorResponse {
    message: string
    status: number
}

export const userWishlistApi = createApi({
    reducerPath: 'userWishlistApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-wishlist'],

    refetchOnMountOrArgChange: true,

    endpoints: (builder) => ({
        getUserWishlist: builder.query<{ items: WishlistItem[] }, string>({
            query: () => "user/wishlist",

            providesTags: ['user-wishlist']
        }),

        addItemToUserWishlist: builder.mutation<Response, { product: WishlistItem["product"], userId: string } >({
            query: ({ product }) => ({
                url: "user/wishlist",
                method: 'POST',
                body: { productId: product.id }
            }),

            transformErrorResponse: (error: any): WishlistErrorResponse => {
                return {
                    message: error.data ? error.data.message : 'Something went wrong',
                    status: error.data ? error.data.status : 500
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

                            // to stringfy non-serializable fields like Date
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

            transformErrorResponse: (error: any): WishlistErrorResponse => {
                return {
                    message: error.data ? error.data.message : 'Something went wrong',
                    status: error.data ? error.data.status : 500
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