import { CartItemWithProduct, QuantityModifiedItem } from "@/types/cart"

export interface CartResponse {
    cart: { items: CartItemWithProduct[] }
    quantityModifiedItems: { [id: string]: QuantityModifiedItem }
}

export interface AddCartItemResponse {
    message: string
    limit: number
    modifiedQuantity?: number
}

export interface RemoveCartItemResponse {
    message: string
}

export interface CartError {
    status: number
    message: string
}