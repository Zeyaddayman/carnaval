"use client"

import SelectMenu from "@/components/ui/SelectMenu"
import { Translation } from "@/types/translation"
import { useRouter, useSearchParams } from "next/navigation"

const OrdersFilter = ({ filter, translation }: { filter: string, translation: Translation["profile"]["orders"] }) => {

    const searchParams = useSearchParams()
    const router = useRouter()

    const filterOptions = [
        { value: "all", label: translation.statusFilter.all },
        { value: "pending", label: translation.statusFilter.pending },
        { value: "completed", label: translation.statusFilter.completed },
        { value: "cancelled", label: translation.statusFilter.cancelled }
    ] as const

    const setFilter = (option: { value: string, label: string }) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set("filter", option.value)

        router.push(`?${params.toString()}`)
    }

    const defaultFilterOption = filterOptions.find(option => option.value === filter) || filterOptions[0]

    return (
        <SelectMenu
            title={`${translation.show}: `}
            selected={defaultFilterOption}
            setSelected={setFilter}
            options={[...filterOptions]}
        />
    )
}

export default OrdersFilter