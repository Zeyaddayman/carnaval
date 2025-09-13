import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generatePagination(
    total: number,
    page: number,
    limit: number
): (number|"...")[] | null
{
    const totalPages = Math.ceil(total / limit)

    if (totalPages === 1) return null

    const paginationPages: (number|"...")[] = []

    paginationPages.push(page)

    let maxPerSide = 2

    // left side
    for (let i = page - 1; (i >= 1 && maxPerSide !== 0); i--) {
        paginationPages.unshift(i)
        maxPerSide--
    }

    const firstIndex = paginationPages[0] as number

    // show the first page if not visible
    if (firstIndex > 1 && firstIndex - 1 > 1) {

        paginationPages.unshift("...")
        paginationPages.unshift(1)

    } else if (firstIndex > 1) {
        paginationPages.unshift(1)
    }

    maxPerSide = 2

    // right side
    for (let i = page + 1; (i <= totalPages && maxPerSide !== 0); i++) {
        paginationPages.push(i)
        maxPerSide--
    }

    const lastIndex = paginationPages[paginationPages.length - 1] as number

    // show the last page if not visible
    if (lastIndex < totalPages && lastIndex + 1 < totalPages) {

        paginationPages.push("...")
        paginationPages.push(totalPages)

    } else if (lastIndex < totalPages) {
        paginationPages.push(totalPages)
    }

    return paginationPages
}