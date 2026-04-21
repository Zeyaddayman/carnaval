"use client"

import { ProductsSortOptionValue } from "@/types/products"
import { useRouter, useSearchParams } from "next/navigation"
import SelectMenu from "../ui/SelectMenu"
import { getProductsSortOptions } from "@/constants/products"
import { Translation } from "@/types/translation"

interface Props {
    sort: ProductsSortOptionValue
    translation: Translation["products"]["sortOptions"]
}

const ProductsSort = ({ sort, translation }: Props) => {

    const searchParams = useSearchParams()
    const router = useRouter()

    const setSort = (option: { value: string, label: string }) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set("sort", option.value)
        params.delete("page")

        router.push(`?${params.toString()}`)
    }

    const productsSortOptions = getProductsSortOptions(translation)

    const defaultSortOption = productsSortOptions.find(option => option.value === sort) || productsSortOptions[0]

    return (
        <SelectMenu
            title={`${translation.title}: `}
            selected={defaultSortOption}
            setSelected={setSort}
            options={[...productsSortOptions]}
        />
    )
}

export default ProductsSort