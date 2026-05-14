import { getBrands } from "@/server/db/brands"

export type BrandWithProductsCount = Awaited<ReturnType<typeof getBrands>>[number]