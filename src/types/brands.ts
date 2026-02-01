import { Prisma } from "@/generated/prisma"
import { brandWithProductsCountSelector } from "@/server/query-selectors/brand"

export type BrandWithProductsCount = Prisma.BrandGetPayload<{
    select: typeof brandWithProductsCountSelector
}>