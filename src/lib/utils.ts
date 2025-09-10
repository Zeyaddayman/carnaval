import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number): number {

    const [int, float] = String(price).split(".")

    return float ? Number(price.toFixed(2)) : Number(int)
}

export function formatRating(rating: number): number {

    const [int, float] = String(rating).split(".")

    return float ? Number(`${int}.${float[0]}`) : Number(int)
}