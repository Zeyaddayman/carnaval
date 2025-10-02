import { Product } from "@/generated/prisma";

export interface CartItem {
    id: Product["id"]
    title: Product["title"]
    thumbnail: Product["thumbnail"]
    brand: string | undefined
    price: Product["price"]
    discountPercentage: Product["discountPercentage"] | null
    qty: number
}