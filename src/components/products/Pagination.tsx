"use client"

import { generatePagination } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"

interface Props {
    total: number,
    page: number,
    limit: number
}

const Pagination = ({ total, page, limit }: Props) => {

    const paginationPages = generatePagination(total, page, limit)
    const totalPages = Math.ceil(total / limit)

    const router = useRouter()
    const searchParams = useSearchParams()

    if (!paginationPages) return

    const handleChangePage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set("page", String(page))

        router.push(`?${params.toString()}`)
    }

    return (
        <div className="mt-8 flex gap-3 items-center justify-center rounded-md">
            <button
                className="px-4 py-3 border border-border cursor-pointer disabled:opacity-50 disabled:cursor-auto"
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 1}
            >
                <RiArrowLeftSLine size={20} />
            </button>
            <div className="flex flex-wrap gap-2">
                {paginationPages.map((paginationPage, i) => (
                    <button
                        key={i}
                        onClick={() => handleChangePage(paginationPage as number)}
                        className={`
                            ${page === paginationPage ? "bg-primary text-primary-foreground" : null}
                            p-3 border border-border cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-auto
                        `}
                        disabled={paginationPage === "..."}
                    >
                        {paginationPage}
                    </button>
                )
                )}
            </div>
            <button
                className="px-4 py-3 border border-border cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-auto"
                onClick={() => handleChangePage(page + 1)}
                disabled={page === totalPages}
            >
                <RiArrowRightSLine size={20} />
            </button>
        </div>
    )
}

export default Pagination