import { CartItemWithProduct } from "@/types/cart";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type QuantityModifiedItem = { oldQuantity: number, newQuantity: number }

interface CartResponse {
    cart: { items: CartItemWithProduct[] }
    quantityModifiedItems: { [id: string]: QuantityModifiedItem }
}

interface AddItemResponse {
    message: string
    limit: number
    modifiedQuantity?: number
}

interface RemoveItemResponse {
    message: string
    status: number
}

export interface CartErrorResponse {
    status: number
    message: string
}

export const userCartApi = createApi({
    reducerPath: 'userCartApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-cart'],

    refetchOnMountOrArgChange: true,

    endpoints: (builder) => ({
        getUserCart: builder.query<CartResponse, string>({
            query: () => "user/cart",

            providesTags: ['user-cart']
        }),

        addItemToUserCart: builder.mutation<AddItemResponse, { product: CartItemWithProduct["product"], quantity: number, userId: string } >({
            query: ({ product, quantity }) => ({
                url: "user/cart",
                method: 'POST',
                body: { productId: product.id, quantity }
            }),

            transformErrorResponse: (error: any): CartErrorResponse => {
                return {
                    message: error.data ? error.data.message : 'Something went wrong',
                    status: error.data ? error.data.status : 500
                }
            },

            async onQueryStarted({ product, quantity, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userCartApi.util.updateQueryData('getUserCart', userId, (draft: CartResponse) => {

                        const existingItem = draft.cart.items.find(item => item.product.id === product.id)

                        if (existingItem) {
                            existingItem.quantity = quantity
                        } else {

                            const tempItem: CartItemWithProduct = {
                                id: crypto.randomUUID(),
                                cartId: "temp",
                                product,
                                quantity,
                                createdAt: JSON.parse(JSON.stringify(new Date()))
                            }

                            draft.cart.items.push(tempItem)
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

        removeItemFromUserCart: builder.mutation<RemoveItemResponse, { productId: string, userId: string } >({
            query: ({ productId }) => ({
                url: "user/cart",
                method: 'DELETE',
                body: { productId }
            }),

            transformErrorResponse: (error: any): CartErrorResponse => {
                return {
                    message: error.data ? error.data.message : 'Something went wrong',
                    status: error.data ? error.data.status : 500
                }
            },

            async onQueryStarted({ productId, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userCartApi.util.updateQueryData('getUserCart', userId, (draft: CartResponse) => {
                        draft.cart.items = draft.cart.items.filter(item => item.product.id !== productId)
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