"use client"

import { MenuCategory } from "@/types/categories"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { BiCheck } from "react-icons/bi"
import { HiMiniChevronUpDown } from "react-icons/hi2"

type CategoryOption = {
    label: string
    value: string
}

interface Props {
    topLevelCategories: MenuCategory[]
    categories: CategoryOption[]
    setCategories: (categories: CategoryOption[]) => void
    selectedCategory: CategoryOption
    setSelectedCategory: (category: CategoryOption) => void
    searchInputFocused: boolean
}

const SearchSelectCategory = ({
    topLevelCategories,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    searchInputFocused

}: Props) => {

    const pathname = usePathname()

    useEffect(() => {

        if (pathname.startsWith("/categories/")) {
            const categorySlug = pathname.split("/")[2]

            if (!categories.find(cat => cat.value === categorySlug)) {
                const topCategoriesWithItsSubs: { label: string, value: string }[] = []

                topLevelCategories.forEach(cat => {
                    topCategoriesWithItsSubs.push({ label: cat.name, value: cat.slug })
                    cat.subcategories.forEach(subcat => topCategoriesWithItsSubs.push({ label: subcat.name, value: subcat.slug }))
                })

                const category = topCategoriesWithItsSubs.find(cat => cat.value === categorySlug)

                if (category) {

                    const newCategories = [
                        { label: category.label, value: category.value },
                        { label: "All", value: "all" },
                        ...topLevelCategories.map(cat => ({ label: cat.name, value: cat.slug }))
                    ]

                    setCategories(newCategories)
                    setSelectedCategory(newCategories[0])
                }

            }
            else {
                const newCategories = [
                    { label: "All", value: "all" },
                    ...topLevelCategories.map(cat => ({ label: cat.name, value: cat.slug }))
                ]

                setCategories(newCategories)
                setSelectedCategory(newCategories.find(cat => cat.value === categorySlug)!)
            }
        }
        else {
            const newCategories = [
                { label: "All", value: "all" },
                ...topLevelCategories.map(cat => ({ label: cat.name, value: cat.slug }))
            ]

            setCategories(newCategories)
            setSelectedCategory(newCategories[0])
        }
    }, [pathname])

    return (
        <Listbox value={selectedCategory} onChange={setSelectedCategory}>
            <div className="relative w-fit flex-1">
                <ListboxButton className={`relative h-10 w-full flex justify-between items-center gap-1 cursor-default rounded-l-md bg-input py-3 px-2 border border-border border-r-0 focus-visible:outline-none focus-visible:ring-3 ${searchInputFocused ? "ring-3 ring-primary" : null} focus-visible:ring-primary sm:text-sm/6 transition-[color,box-shadow]`}>
                    <div className="truncate">{selectedCategory.label}</div>
                    <span className="pointer-events-none">
                        <HiMiniChevronUpDown />
                    </span>
                </ListboxButton>

                <ListboxOptions
                    transition
                    className={`absolute max-h-[80vh] overflow-y-auto w-fit min-w-50 z-30 mt-1 rounded-md bg-input py-1 text-base shadow-lg border-2 border-border focus:outline-none data-closed:data-leave:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in sm:text-sm`}
                >
                    {categories.map((category) => (
                        <ListboxOption
                            key={category.value}
                            value={category}
                            className="group relative flex items-center justify-between gap-2 cursor-default select-none py-1 pl-1 pr-3 text-gray-900 data-focus:bg-primary data-focus:text-white"
                        >
                            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                                {category.label}
                            </span>

                            <span className="text-primary group-data-focus:text-white [.group:not([data-selected])_&]:hidden">
                                <BiCheck aria-hidden="true" className="size-5" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    )
}

export default SearchSelectCategory