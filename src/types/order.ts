import { Prisma } from "@/generated/prisma"
import { tableOrderSelector } from "@/server/query-selectors/order"

export type TableOrder = Prisma.OrderGetPayload<{
    select: typeof tableOrderSelector
}>