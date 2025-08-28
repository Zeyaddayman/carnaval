"use client"

import { PRODUCTS_SORT_OPTIONS } from "@/constants"
import { ProductsSortOption } from "@/types/products"
import { useRouter, useSearchParams } from "next/navigation"

const ProductsSort = () => {

    const searchParams = useSearchParams()
    const router = useRouter()

    const handleSortChange = (value: ProductsSortOption) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("sort", value)
        router.push(`?${params.toString()}`)
    }

    return (
        <div>
            <label htmlFor="sort" className="mr-2 font-medium">
                Sort by:
            </label>
            <select
                id="sort"
                name="sort"
                className="border border-gray-300 rounded-md p-2"
                onChange={(e) => handleSortChange(e.target.value as ProductsSortOption)}
                value={searchParams.get("sort") || "alphabetical"}
            >
                {PRODUCTS_SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ProductsSort