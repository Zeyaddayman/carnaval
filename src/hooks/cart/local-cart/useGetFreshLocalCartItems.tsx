"use client"

import { CartItemWithProduct, QuantityModifiedItem } from "@/types/cart"
import { getProductLimit } from "@/utils/product"
import { useEffect, useState } from "react"

const useGetFreshLocalCartItems = (localCartItems: CartItemWithProduct[] ) => {

    const [freshLocalCartItems, setFreshLocalCartItems] = useState<CartItemWithProduct[] | null>(null)

    const [quantityModifiedItems, setQuantityModifiedItems] = useState<{ [id: string]: QuantityModifiedItem }>({})

    useEffect(() => {

        const updateCartItems = async () => {

            const freshCartProducts = await Promise.all(localCartItems.map(async item => {

                const res = await fetch(`/api/product/${item.product.id}`)

                if (res.ok) return (await res.json()) as CartItemWithProduct["product"]
            }))

            const quantityModifiedItems: { [id: string]: QuantityModifiedItem } = {}

            let freshCartItems = localCartItems.map<CartItemWithProduct>(item => {

                const freshProduct = freshCartProducts.find(product => product?.id === item.product.id)

                if (!freshProduct) return item

                const limit = getProductLimit(freshProduct.stock, freshProduct.limit)

                let itemQuantity = item.quantity

                if (item.quantity > limit && limit !== 0) {

                    itemQuantity = limit

                    quantityModifiedItems[item.id] = {
                        oldQuantity: item.quantity,
                        newQuantity: itemQuantity
                    }
                }

                return {
                    ...item,
                    product: freshProduct,
                    quantity: itemQuantity
                }

            })

            setFreshLocalCartItems(freshCartItems)

            setQuantityModifiedItems(quantityModifiedItems)
        }

        updateCartItems()

    }, [])

    return { freshLocalCartItems, quantityModifiedItems }
}

export default useGetFreshLocalCartItems