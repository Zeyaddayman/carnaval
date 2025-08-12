"server-only"

import { db } from "@/lib/prisma"
import { unstable_cache as next_cache } from "next/cache"
import { cache as react_cache } from "react";

export const getTopLevelCategories = react_cache(next_cache(
    async () => {
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
    { revalidate: 60 * 60 } // revalidate every 60 minutes
))