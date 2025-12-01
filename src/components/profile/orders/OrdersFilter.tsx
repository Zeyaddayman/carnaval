"use client"

import SelectMenu from "@/components/ui/SelectMenu"
import { useRouter, useSearchParams } from "next/navigation"

const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
] as const

const OrdersFilter = ({ filter }: { filter: string }) => {

    const searchParams = useSearchParams()
    const router = useRouter()

    const setFilter = (option: { value: string, label: string }) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set("filter", option.value)

        router.push(`?${params.toString()}`)
    }

    const defaultFilterOption = filterOptions.find(option => option.value === filter) || filterOptions[0]

    return (
        <SelectMenu
            title={"Show: "}
            selected={defaultFilterOption}
            setSelected={setFilter}
            options={[...filterOptions]}
        />
    )
}

export default OrdersFilter