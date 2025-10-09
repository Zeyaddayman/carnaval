import { CartWithItems } from "@/types/cart";
import { ProductWithRelations } from "@/types/products";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserCartApi = createApi({
    reducerPath: 'UserCartApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    tagTypes: ['user-cart'],

    endpoints: (builder) => ({
        getUserCart: builder.query<CartWithItems, string>({
            query: () => "cart",

            providesTags: (result, error, userId) => [{ type: 'user-cart', id: userId }]
        }),

        addItemToUserCart: builder.mutation<CartWithItems, { product: ProductWithRelations, quantity: number, userId: string } >({
            query: ({ product, quantity }) => ({
                url: "cart",
                method: 'POST',
                body: { productId: product.id, quantity }
            }),

            async onQueryStarted({ product, quantity, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    UserCartApi.util.updateQueryData('getUserCart', userId, (draft: CartWithItems) => {

                        const existingItem = draft.items.find(item => item.productId === product.id)

                        if (existingItem) {
                            existingItem.quantity = quantity
                        } else {

                            // to stringify non-serializable data types like Date
                            const serializableProduct = JSON.parse(JSON.stringify(product))

                            const tempItem: CartWithItems["items"][number] = {
                                id: crypto.randomUUID(),
                                productId: product.id,
                                cartId: "temp",
                                quantity,
                                product: serializableProduct
                            }

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

            invalidatesTags: ['user-cart']

        }),

        removeItemFromUserCart: builder.mutation<CartWithItems, { productId: string, userId: string } >({
            query: ({ productId }) => ({
                url: "cart",
                method: 'DELETE',
                body: { productId }
            }),

            async onQueryStarted({ productId, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    UserCartApi.util.updateQueryData('getUserCart', userId, (draft: CartWithItems) => {
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

} = UserCartApi