import { getProductFinalPrice, getProductLimit } from "./product"

export function createOrderItems(
    items: {
        product: { id: string, price: number, discountPercentage: number | null, stock: number, limit: number | null},
        quantity: number
    }[],
    userId: string
) {

    let isValidQuantities = true

    const result = items.map(item => {
    
        const productLimit = getProductLimit(item.product.stock, item.product.limit)

        if (productLimit < item.quantity || productLimit <= 0) {
            isValidQuantities = false
        }
    
        const finalPrice = getProductFinalPrice(item.product.price, item.product.discountPercentage)

        return {
            productId: item.product.id,
            quantity: item.quantity,
            price: finalPrice,
            userId
        }
    })

    return { orderItems: result, isValidQuantities }
}