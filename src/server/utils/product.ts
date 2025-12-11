export async function fetchProductLimit(productId: string) {

    const res = await fetch(`/api/product/${productId}/limit`)

    if (res.status === 200) {

        const { productLimit } = await res.json()

        return productLimit as number
    }
}