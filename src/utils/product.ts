export function productHasDiscount(discountPercentage: number | null) {
    return (discountPercentage && discountPercentage > 0) ? true : false
}

export function getProductFinalPrice(price: number, discountPercentage: number | null) {

    const hasDiscount = productHasDiscount(discountPercentage)

    return hasDiscount ? price - price * discountPercentage! / 100 : price
}

export function getProductLimit(stock: number, limit: number | null) {
    return (limit && limit <= stock) ? limit : stock
}