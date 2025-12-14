import { Prisma } from "@/generated/prisma";

export const cardProductSelector = {
    id: true,
    title: true,
    thumbnail: true,
    price: true,
    discountPercentage: true,
    finalPrice: true,
    rating: true,
    stock: true,
    limit: true,
    brand: {
        select: {
            name: true
        }
    }
} satisfies Prisma.ProductSelect

export const productDetailsSelector = {
    id: true,
    title: true,
    description: true,
    thumbnail: true,
    price: true,
    discountPercentage: true,
    finalPrice: true,
    rating: true,
    stock: true,
    limit: true,
    images: true,
    categories: {
        select: {
            name: true,
            slug: true,
            subCategoryName: true
        }
    },
    brand: {
        select: { name: true }
    }
} satisfies Prisma.ProductSelect