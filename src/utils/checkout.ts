import { getProductLimit } from "./product"

export function createOrderItems(
    items: {
        product: { id: string, finalPrice: number, stock: number, limit: number | null},
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

        return {
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.finalPrice,
            userId
        }
    })

    return { orderItems: result, isValidQuantities }
}