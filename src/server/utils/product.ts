export async function fetchProductLimit(productId: string) {

    try {
        const res = await fetch(`/api/product/${productId}/limit`)

        if (res.status === 200) {

            const data = await res.json()

            return data.productLimit as number | null
        }
    }
    catch {
        return null
    }

    return null
}