import { db } from "@/lib/prisma";
import { Product } from "@/generated/prisma";

export const getProduct = async (id: Product["id"]) => {
    const product = await db.product.findUnique({ 
        where: { id } ,
        include: {
            categories: true,
            brand: true
        }
    })

    if (!product) {
        throw new Error(`Product with id "${id}" not found`)
    }

    return product
}