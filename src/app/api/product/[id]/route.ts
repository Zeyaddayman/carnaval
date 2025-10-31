import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const productId = (await params).id

    const product = await db.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            title: true,
            thumbnail: true,
            price: true,
            discountPercentage: true,
            rating: true,
            stock: true,
            limit: true,
            brand: {
                select: {
                    name: true
                }
            }
        }
    })

    if (!product) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
}