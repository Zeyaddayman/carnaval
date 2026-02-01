import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams

    let query = searchParams.get("query")
    const categorySlug = searchParams.get("category") || "all"

    if (!query || typeof query !== "string" || !query.trim()) {
        return NextResponse.json([], { status: 200 })
    }

    const searchTearm = query.trim()

    const categoryFilter = (categorySlug && categorySlug !== "all") ? { some: { slug: categorySlug } } : undefined

    try {
        let suggestedProducts = await db.product.findMany({
        where: {
            OR: [
                { title: { contains: searchTearm, mode: 'insensitive' } },
                { description: { contains: searchTearm, mode: 'insensitive' } }
            ],
            categories: categoryFilter
        },
        select: {
            title: true
        },
            take: 10
        })

        const suggestions = suggestedProducts.map(product => product.title.toLowerCase())

        return NextResponse.json(suggestions, { status: 200 })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}