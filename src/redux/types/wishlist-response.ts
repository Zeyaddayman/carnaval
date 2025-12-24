import { wishlistItemWithProduct } from "@/types/wishlist";

export interface WishlistResponse {
    items: wishlistItemWithProduct[]
}

export interface AddWishlistItemResponse {
    message: string
}

export interface RemoveWishlistItemResponse {
    message: string
}

export interface WishlistError {
    message: string
    status: number
}