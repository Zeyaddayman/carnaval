"use client"

import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import Dialog from "../ui/Dialog"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"
import Input from "../ui/Input"
import { ProductsFiltersOptions } from "@/types/products"
import { useRouter, useSearchParams } from "next/navigation"
import { PRODUCTS_FILTERS, PRODUCTS_MAX_RATING } from "@/constants/products"
import { BiStar } from "react-icons/bi"
import { CiDiscount1 } from "react-icons/ci"
import { TbRosetteDiscountCheck } from "react-icons/tb"
import { Translation } from "@/types/translation"
import { inject } from "@/utils/translation"
import { Language } from "@/types/i18n"

interface Props {
    initialFilters: ProductsFiltersOptions
    productsMinRating: number
    lang: Language
    translation: Translation["products"]["filters"]
}

const ProductsFilters = ({ initialFilters, productsMinRating, lang, translation }: Props) => {

    const [isOpen, setIsOpen] = useState(false)

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    const [filters, setFilters] = useState<ProductsFiltersOptions>(initialFilters)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        setFilters(initialFilters)
    }, [initialFilters])

    const setMinPrice = (minPrice: number) => {
        setFilters(prev => ({ ...prev, minPrice }))
    }

    const setMaxPrice = (maxPrice: number) => {
        setFilters(prev => ({ ...prev, maxPrice }))
    }

    const setMinRating = (minRating: number) => {
        setFilters(prev => ({ ...prev, minRating }))
    }

    const setOnlyOnSale = (onlyOnSale: boolean) => {
        setFilters(prev => ({ ...prev, onlyOnSale }))
    }

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        Object.keys(PRODUCTS_FILTERS).forEach(key => {
            const filterKey = key as keyof ProductsFiltersOptions

            // Only update filters that have changed
            if (filters[filterKey] !== initialFilters[filterKey]) {
                params.set(filterKey, String(filters[filterKey]))
            }
        })

        params.delete("page")

        router.push(`?${params.toString()}`)
        close()
    }

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        Object.keys(PRODUCTS_FILTERS).forEach(filterKey => params.delete(filterKey))

        params.delete("page")

        router.push(`?${params.toString()}`)
        close()
    }

    return (
        <div>
            <Button
                variant={"primary"}
                size={"lg"}
                onClick={open}
            >
                <HiOutlineAdjustmentsHorizontal size={20} /> {translation.buttonText}
            </Button>
            <Dialog
                isOpen={isOpen}
                close={close}
                title={translation.title}
            >
                <div className="space-y-4">
                    <PriceRange
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        setMinPrice={setMinPrice}
                        setMaxPrice={setMaxPrice}
                        translation={translation}
                    />
                    <RatingRange
                        productsMinRating={productsMinRating}
                        minRating={filters.minRating}
                        setMinRating={setMinRating}
                        lang={lang}
                        translation={translation}
                    />
                    <OnlyOnSaleToggle
                        onlyOnSale={filters.onlyOnSale}
                        setOnlyOnSale={setOnlyOnSale}
                        translation={translation}
                    />
                </div>
                <div className="flex justify-between items-center mt-5">
                    <Button
                        variant={"cancel"}
                        onClick={clearFilters}
                    >
                        {translation.clearFilters}
                    </Button>
                    <Button onClick={applyFilters}>
                        {translation.applyFilters}
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

const PriceRange = ({ 
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    translation
}: {
    minPrice: number,
    maxPrice: number,
    setMinPrice: (minPrice: number) => void,
    setMaxPrice: (maxPrice: number) => void,
    translation: Translation["products"]["filters"]
}) => {
    return (
        <div>
            <h4 className="font-semibold mb-2">{translation.priceRange}</h4>
            <div className="flex gap-2 justify-between items-center">
                <Input 
                    name="min-price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                />
                {translation.to}
                <Input
                    name="max-price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
            </div>
        </div>
    )
}

const RatingRange = ({
    productsMinRating,
    minRating,
    setMinRating,
    lang,
    translation
}: {
    productsMinRating: number,
    minRating: number,
    setMinRating: (minRating: number) => void,
    lang: Language,
    translation: Translation["products"]["filters"]
}) => {

    const fillPercentage = (minRating - productsMinRating) / (PRODUCTS_MAX_RATING - productsMinRating) * 100

    return (
        <div>
            <h4 className="font-semibold mb-2">{translation.ratingRange}</h4>
            <p className="text-primary mb-2">
                {minRating === PRODUCTS_MAX_RATING
                    ? inject(translation.onlyStars, { rating: minRating })
                    : inject(translation.starsOrMore, { rating: minRating })
                }
            </p>
            <input
                className="appearance-none w-full h-3 rounded-md cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-primary/50"
                id="range-input"
                type="range"
                min={productsMinRating}
                max={PRODUCTS_MAX_RATING}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                style={{
                    background: `linear-gradient(to ${lang === "ar" ? "left" : "right"}, var(--input) 0%, var(--input) ${fillPercentage}%, var(--primary) ${fillPercentage}%, var(--primary) 100%)`,
                }}
            />
            <div className="flex justify-between items-center">
                <span className="flex gap-1 items-center">{productsMinRating} <BiStar /></span>
                <span className="flex gap-1 items-center">{PRODUCTS_MAX_RATING} <BiStar /></span>
            </div>
        </div>
    )
}

const OnlyOnSaleToggle = ({ 
    onlyOnSale,
    setOnlyOnSale,
    translation
}: {
    onlyOnSale: boolean,
    setOnlyOnSale: (onlyOnSale: boolean) => void,
    translation: Translation["products"]["filters"]
}) => {
    return (
        <div>
            <h4 className="font-semibold mb-2">{translation.show}</h4>
            <div className="flex gap-2 justify-between items-center">
                <div className="flex-1">
                    <input
                        type="radio"
                        className="peer sr-only"
                        id="all-products"
                        checked={onlyOnSale === false}
                        onChange={() => setOnlyOnSale(false)}
                    />
                    <label
                        htmlFor="all-products"
                        className={`${!onlyOnSale ? "border-primary" : "border-border"} peer-focus-visible:ring-3 peer-focus-visible:ring-primary/50 border-2 bg-input p-2 cursor-pointer w-full rounded-md flex items-center gap-2 transition`}
                    >
                        <TbRosetteDiscountCheck /> {translation.allProducts}
                    </label>
                </div>
                <div className="flex-1">
                    <input
                        type="radio"
                        className="peer sr-only"
                        id="only-on-sale"
                        checked={onlyOnSale === true}
                        onChange={() => setOnlyOnSale(true)}
                    />
                    <label
                        htmlFor="only-on-sale"
                        className={`${onlyOnSale ? "border-primary" : "border-border"} peer-focus-visible:ring-3 peer-focus-visible:ring-primary/50 border-2 bg-input p-2 cursor-pointer w-full rounded-md flex items-center gap-2 transition`}
                    >
                        <CiDiscount1 /> {translation.onSaleOnly}
                    </label>
                </div>
            </div>
        </div>
    )
}

export default ProductsFilters