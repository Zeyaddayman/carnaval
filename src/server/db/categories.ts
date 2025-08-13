"server-only"

import { db } from "@/lib/prisma"
import { unstable_cache as nextCache } from "next/cache"
import { cache as reactCache } from "react"

export const getTopLevelCategories = reactCache(nextCache(
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
    ["top-categories"],
    { 
        revalidate: 60 * 60,    // revalidate every 60 minutes
        tags: ["top-categories"]
    } 
))