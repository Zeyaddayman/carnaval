"server-only"

import { db } from "@/lib/prisma"
import { unstable_cache as next_cache } from "next/cache"

export const getTopLevelCategories = async () => next_cache(async () => {
    console.log("Fetching categories from the database...")
    return await db.category.findMany({
        where: {
            AND: [
                { parentId: null },
                { children: { some: {} } }
            ]
        },
        orderBy: {
            createdAt: "asc"
        },
        include: {
            children: true
        }
    })
},
    ["all-categories"],
    { revalidate: 60 * 30 } // revalidate every 30 minutes
)()