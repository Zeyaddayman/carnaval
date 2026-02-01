"use client"

import { CiSearch } from "react-icons/ci"
import Input from "../ui/Input"
import { Button } from "../ui/Button"
import SearchSelectCategory from "./SearchSelectCategory"
import { ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useRef, useState, FormEvent } from "react"
import { MenuCategory } from "@/types/categories"
import { useRouter } from "next/navigation"

interface Props {
    topLevelCategories: MenuCategory[]
}

let timeout: NodeJS.Timeout

const debouncedSearch = (cb: () => void, time: number) => {

    clearTimeout(timeout)

    timeout = setTimeout(() => {
        cb()
    }, time)
}

const SearchBar = ({ topLevelCategories }: Props) => {

    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [searchInputFocused, setSearchInputFocused] = useState(false)
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [tempSearchQuery, setTempSearchQuery] = useState("")
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])

    const [categories, setCategories] = useState<{ label: string; value: string }[]>([
        { label: "All", value: "all" },
        ...topLevelCategories.map(cat => ({ label: cat.name, value: cat.slug }))
    ])
    const [selectedCategory, setSelectedCategory] = useState(categories[0])

    const router = useRouter()

    useEffect(() => {

        if (activeSuggestionIndex <= 0) {
            setTempSearchQuery("")
            return
        }

        if (activeSuggestionIndex > 0 && activeSuggestionIndex <= searchSuggestions.length) {
            setTempSearchQuery(searchSuggestions[activeSuggestionIndex - 1])
        }
    }, [activeSuggestionIndex])

    const setCategory = (category: { label: string; value: string }) => {
        setSelectedCategory(category)
    }

    const navigateToSearchPage = (query: string, categorySlug: string) => {

        const trimedQuery = query.trim()

        if (!trimedQuery) return

        setSearchQuery(trimedQuery)
        setTempSearchQuery("")
        router.push(`/search?query=${trimedQuery}&category=${categorySlug}`)

        setSearchInputFocused(false)
        setActiveSuggestionIndex(0)
        setIsOpen(false)
    }

    const toggleSearchBar = () => {
        if (!isOpen) {
            setIsOpen(true)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
        else {
            setIsOpen(false)
            setActiveSuggestionIndex(0)
        }
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value

        if (tempSearchQuery) setTempSearchQuery("")

        setSearchQuery(value)

        debouncedSearch(async () => {
            const res = await fetch(`/api/products/suggestions?category=${selectedCategory.value}&query=${value}`)

            if (res.ok && res.status === 200) {
                const data = await res.json()

                setSearchSuggestions(data)
            }
        }, 400)
    }

    const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            setActiveSuggestionIndex((prevIndex) => (prevIndex + 1) % (searchSuggestions.length + 1))
        }
        else if (e.key === "ArrowUp") {
            setActiveSuggestionIndex((prevIndex) =>
                prevIndex !== 0
                    ? (prevIndex - 1 + searchSuggestions.length) % searchSuggestions.length
                    : ((prevIndex - 1 + searchSuggestions.length) % searchSuggestions.length) + 1
            )
        }
    }

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {

        setActiveSuggestionIndex(0)

        if (tempSearchQuery) {
            setTempSearchQuery("")
            setSearchQuery(tempSearchQuery)
        }

        if (e.relatedTarget && (e.relatedTarget).closest("#suggestions-tab")) {
            return
        }

        if (e.relatedTarget && ((e.relatedTarget).closest("#search-bar-toggle") || (e.relatedTarget).closest("#search-form"))) {
            setSearchInputFocused(false)
            return
        }

        setIsOpen(false)
        setSearchInputFocused(false)
    }

    const handleOnSuggestClick = (index: number) => {

        const query = searchSuggestions[index]

        navigateToSearchPage(query, selectedCategory.value)
    }

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const query = tempSearchQuery ? tempSearchQuery : searchQuery

        navigateToSearchPage(query, selectedCategory.value)
    }

    return (
        <div>
            {/* Backdrop */}
            {searchInputFocused && <div className="absolute left-0 top-20 bottom-0 w-full bg-black/50 z-20"></div>}

            <Button
                variant={"ghost"}
                onClick={toggleSearchBar}
                aria-label={isOpen ? "Close Search Bar" : "Open Search Bar"}
                id="search-bar-toggle"
            >
                <CiSearch size={20} stroke={isOpen ? "var(--primary)" : "black"} strokeWidth={1} />
            </Button>

            <form
                className={`absolute left-1/2 ${isOpen ? "top-20 z-30" : "top-0 -z-10"} w-full md:w-190 flex max-h-10 -translate-x-1/2`}
                style={{ transition: `top 300ms${isOpen ? ", z-index 0ms 300ms": ""}` }}
                inert={!isOpen}
                id="search-form"
                onSubmit={handleOnSubmit}
            >
                <SearchSelectCategory
                    topLevelCategories={topLevelCategories}
                    categories={categories}
                    setCategories={setCategories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setCategory}
                    searchInputFocused={searchInputFocused}
                />
                <Input
                    ref={inputRef}
                    id="search"
                    name="search"
                    type="search"
                    autoComplete="off"
                    placeholder="Search for products..."
                    className="w-full pr-10 h-10 border-l-0 rounded-l-none"
                    value={tempSearchQuery ? tempSearchQuery : searchQuery}
                    onChange={handleOnChange}
                    onFocus={() => setSearchInputFocused(true)}
                    onBlur={handleOnBlur}
                    onKeyDown={handleOnKeyDown}
                />
                <Button
                    variant={"primary"}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-10 rounded-none rounded-r-md"
                    aria-label="Search"
                    type="submit"
                >
                    <CiSearch size={20} stroke="white" strokeWidth={2} />
                </Button>
            </form>
            {searchInputFocused && searchQuery && searchSuggestions.length ?
                <ul
                    className={`absolute flex flex-col left-1/2 top-31 max-h-100 z-30 w-full md:w-190 bg-white -translate-x-1/2 shadow-lg border-border rounded-b-md overflow-y-auto`}
                    id="suggestions-tab"
                    tabIndex={-1}
                >
                    {searchSuggestions.map((suggest, index) => (
                        <li
                            key={index}
                            aria-rowindex={index + 1}
                            className={`${activeSuggestionIndex === index + 1 ? "bg-gray-100" : ""} relative flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer`}
                            onClick={() => handleOnSuggestClick(index)}
                        >
                            <span className={`${activeSuggestionIndex === index + 1 ? "bg-primary" : "bg-transparent"} absolute h-full w-1.5 left-0 top-0`}></span>
                            <CiSearch size={17} />
                            {suggest}
                        </li>
                    ))}
                </ul>
            : null}
        </div>
    )
}

export default SearchBar