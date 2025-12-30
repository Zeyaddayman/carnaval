"use client"

import { generatePagination } from "@/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"
import { Button } from "../ui/Button"

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

    const changePage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set("page", String(page))

        router.push(`?${params.toString()}`)
    }

    return (
        <div className="mt-8 flex gap-2 items-center justify-center rounded-md">
            <Button
                variant={"basic"}
                className="!px-2 !h-10"
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                aria-label="Previous Page"
            >
                <RiArrowLeftSLine size={20} />
            </Button>
            <div className="flex flex-wrap gap-2">
                {paginationPages.map((paginationPage, i) => (
                    <Button
                        key={i}
                        variant={"basic"}
                        onClick={() => changePage(paginationPage as number)}
                        className={`${page === paginationPage ? "!bg-primary !text-primary-foreground" : null} !w-8 !h-10`}
                        disabled={paginationPage === ".."}
                        aria-label={paginationPage === ".." ? "Ellipsis" : `Page ${paginationPage}`}
                    >
                        {paginationPage}
                    </Button>
                ))}
            </div>
            <Button
                variant={"basic"}
                className="!px-2 !h-10"
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next Page"
            >
                <RiArrowRightSLine size={20} />
            </Button>
        </div>
    )
}

export default Pagination