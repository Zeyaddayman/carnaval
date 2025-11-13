import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "../ui/Button"

const NoProductsFound = ({ clearFiltersLink }: { clearFiltersLink: string }) => {
    return (
        <div className="flex justify-center items-center mt-10">
            <div className="text-center">
                <Image
                    src={"/images/no-data.svg"}
                    alt="no-products"
                    className="mx-auto"
                    width={300}
                    height={293}
                />
                <h1 className="text-3xl font-bold mt-5">We Couldn't Find a Match</h1>
                <p className="text-muted-foreground my-3">Let's clear your filters and start over.</p>
                <div className="flex flex-col gap-2">
                    <Link
                        href={clearFiltersLink}
                        className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                    >
                        Clear Filters
                    </Link>
                    <Link
                        href={"/categories"}
                        className={`${buttonVariants({ variant: "secondary", size: "lg" })}`}
                    >
                        Return to Categories
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NoProductsFound