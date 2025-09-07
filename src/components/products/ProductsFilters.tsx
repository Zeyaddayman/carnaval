"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { Button } from "../ui/Button"
import Dialog from "../ui/Dialog"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import Input from "../ui/Input"
import { ProductsFiltersOptions } from "@/types/products"
import { useRouter, useSearchParams } from "next/navigation"

interface Props {
    initialFilters: ProductsFiltersOptions
}

const ProductsFilters = ({ initialFilters }: Props) => {

    const [isOpen, setIsOpen] = useState(false)

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    const [filters, setFilters] = useState<ProductsFiltersOptions>(initialFilters)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        setFilters(initialFilters)
    }, [initialFilters])

    const handlePriceRangeChange = (e: ChangeEvent<HTMLInputElement>) => {

        console.log(filters.minPrice, filters.maxPrice)

        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: Number(value)
        }))
    }

    const applyFilters = () => {

        const params = new URLSearchParams(searchParams.toString())

        params.set("minPrice", filters.minPrice.toString())
        params.set("maxPrice", filters.maxPrice.toString())

        router.push(`?${params.toString()}`)
        close()
    }

    return (
        <div>
            <Button
                onClick={open}
            >
                <HiOutlineAdjustmentsHorizontal size={20} /> Open Filters
            </Button>
            <Dialog
                isOpen={isOpen}
                close={close}
                title="Filter Products"
            >
                <h4 className="font-semibold mb-2">Price range</h4>
                <div className="flex gap-2 justify-between items-center">
                    <Input 
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handlePriceRangeChange}
                    />
                    TO
                    <Input
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handlePriceRangeChange}
                    />
                </div>
                <div className="flex justify-between items-center mt-5">
                    <Button
                        variant={"cancel"}
                    >
                        Clear Filters
                    </Button>
                    <Button onClick={applyFilters}>
                        Apply Filters
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ProductsFilters