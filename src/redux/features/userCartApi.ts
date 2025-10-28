import { CartItemWithProduct, CartWithItems } from "@/types/cart";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AddItemResponse {
    message?: string,
    modified?: string,
    limit?: number,
}

export interface ApiErrorResponse {
    status: number
    errorMessage?: string
}

export const userCartApi = createApi({
    reducerPath: 'userCartApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-cart'],

    endpoints: (builder) => ({
        getUserCart: builder.query<CartWithItems, string>({
            query: () => "user/cart",

            providesTags: ['user-cart']
        }),

        addItemToUserCart: builder.mutation<AddItemResponse, { product: CartItemWithProduct["product"], quantity: number, userId: string } >({
            query: ({ product, quantity }) => ({
                url: "user/cart",
                method: 'POST',
                body: { productId: product.id, quantity }
            }),

            transformErrorResponse: (error: any): ApiErrorResponse => {
                if (error.data) {
                    return {
                        status: error.status,
                        errorMessage: error.data.errorMessage
                    }
                } else {
                    return {
                        status: 500,
                        errorMessage: 'Something went wrong'
                    }
                }
            },

            async onQueryStarted({ product, quantity, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userCartApi.util.updateQueryData('getUserCart', userId, (draft: CartWithItems) => {

                        const existingItem = draft.items.find(item => item.productId === product.id)

                        if (existingItem) {
                            existingItem.quantity = quantity
                        } else {

                            const tempItem: CartWithItems["items"][number] = {
                                id: crypto.randomUUID(),
                                cartId: "temp",
                                productId: product.id,
                                product,
                                quantity,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }

                            // to stringify non-serializable data types like Date
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

            invalidatesTags: ['user-cart']

        }),

        removeItemFromUserCart: builder.mutation<CartWithItems, { productId: string, userId: string } >({
            query: ({ productId }) => ({
                url: "user/cart",
                method: 'DELETE',
                body: { productId }
            }),

            transformErrorResponse: (error: any): ApiErrorResponse => {
                if (error.data) {
                    return {
                        status: error.status,
                        errorMessage: error.data.errorMessage
                    }
                } else {
                    return {
                        status: 500,
                        errorMessage: 'Something went wrong'
                    }
                }
            },

            async onQueryStarted({ productId, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userCartApi.util.updateQueryData('getUserCart', userId, (draft: CartWithItems) => {
                        draft.items = draft.items.filter(item => item.productId !== productId)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },

            invalidatesTags: ['user-cart']
        })
    })
})

export const {
    useGetUserCartQuery,
    useAddItemToUserCartMutation,
    useRemoveItemFromUserCartMutation

} = userCartApi