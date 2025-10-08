import { CartWithItems } from "@/types/cart";
import { ProductWithRelations } from "@/types/products";
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
        addItemToUserCart: builder.mutation<CartWithItems, { product: ProductWithRelations, quantity: number } >({
            query: ({ product, quantity }) => ({
                url: "cart",
                method: 'POST',
                body: { productId: product.id, quantity }
            }),

            async onQueryStarted({ product, quantity }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    UserCartApi.util.updateQueryData('getUserCart', undefined, (draft: CartWithItems) => {

                        const existingItem = draft.items.find(item => item.productId === product.id)

                        if (existingItem) {
                            existingItem.quantity = quantity
                        } else {

                            // to stringify non-serializable data types like (date, functions, ...etc) in this case Date
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
        removeItemFromUserCart: builder.mutation<CartWithItems, string >({
            query: (productId) => ({
                url: "cart",
                method: 'DELETE',
                body: { productId }
            }),

            async onQueryStarted(productId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    UserCartApi.util.updateQueryData('getUserCart', undefined, (draft: CartWithItems) => {
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