"use client"

import { DEFAULT_SORT_OPTION, PRODUCTS_SORT_OPTIONS } from "@/constants/products"
import { ProductsSortOptionValue } from "@/types/products"
import { useRouter, useSearchParams } from "next/navigation"
import SelectMenu from "../ui/SelectMenu"

interface Props {
    sort: ProductsSortOptionValue
}

const ProductsSort = ({ sort }: Props) => {

    const searchParams = useSearchParams()
    const router = useRouter()

    const setSort = (option: { value: string, label: string }) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set("sort", option.value)
        params.delete("page")

        router.push(`?${params.toString()}`)
    }

    const defaultSortOption = PRODUCTS_SORT_OPTIONS.find(option => option.value === sort) || DEFAULT_SORT_OPTION

    return (
        <SelectMenu
            title="Sort By: "
            selected={defaultSortOption}
            setSelected={setSort}
            options={[...PRODUCTS_SORT_OPTIONS]}
        />
    )
}

export default ProductsSort