"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { Button } from "../ui/Button"
import Dialog from "../ui/Dialog"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import Input from "../ui/Input"
import { ProductsFiltersOptions } from "@/types/products"
import { useRouter, useSearchParams } from "next/navigation"
import { BiStar } from "react-icons/bi"

interface Props {
    initialFilters: ProductsFiltersOptions
    rating: { min: number, max: number }
}

const ProductsFilters = ({ initialFilters, rating }: Props) => {

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
        const { name, value } = e.target

        setFilters(prev => ({
            ...prev,
            [name]: Number(value)
        }))
    }

    const handleRatingRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({
            ...prev,
            minRating: Number(e.target.value)
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
                <div className="space-y-3">
                    <PriceRange
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        handlePriceRangeChange={handlePriceRangeChange}
                    />
                    <RatingRange
                        ratingValue={filters.minRating}
                        minRating={rating.min}
                        maxRating={rating.max}
                        handleRatingRangeChange={handleRatingRangeChange}
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

const PriceRange = ({ 
    minPrice,
    maxPrice,
    handlePriceRangeChange
}: {
    minPrice: number,
    maxPrice: number,
    handlePriceRangeChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
    return (
        <div>
            <h4 className="font-semibold mb-2">Price range</h4>
            <div className="flex gap-2 justify-between items-center">
                <Input 
                    name="minPrice"
                    type="number"
                    value={minPrice}
                    onChange={handlePriceRangeChange}
                />
                TO
                <Input
                    name="maxPrice"
                    type="number"
                    value={maxPrice}
                    onChange={handlePriceRangeChange}
                />
            </div>
        </div>
    )
}

const RatingRange = ({
    ratingValue,
    minRating,
    maxRating,
    handleRatingRangeChange
}: {
    ratingValue: number,
    minRating: number,
    maxRating: number,
    handleRatingRangeChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => {

    const fillPercentage = (ratingValue - minRating) / (maxRating - minRating) * 100

    return (
        <div>
            <h4 className="font-semibold mb-2">Rating range</h4>
            <p className="text-primary mb-2">
                {ratingValue === maxRating ? `Only ${ratingValue} stars` : `${ratingValue} Stars or more`}
            </p>
            <input
                className="appearance-none w-full h-3 rounded-md cursor-pointer outline-none"
                id="range-input"
                type="range"
                min={minRating}
                max={maxRating}
                step={0.1}
                value={ratingValue}
                onChange={handleRatingRangeChange}
                style={{
                    background: `linear-gradient(to right, var(--input) 0%, var(--input) ${fillPercentage}%, var(--primary) ${fillPercentage}%, var(--primary) 100%)`,
                }}
            />
            <div className="flex justify-between items-center">
                <span className="flex gap-1 items-center">{minRating} <BiStar /></span>
                <span className="flex gap-1 items-center">{maxRating} <BiStar /></span>
            </div>
        </div>
    )
}

export default ProductsFilters