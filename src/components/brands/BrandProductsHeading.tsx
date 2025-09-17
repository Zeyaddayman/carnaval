import { Category } from "@/generated/prisma"
import { getBrand } from "@/server/db/brands"
import Link from "next/link"

interface Props {
    slug: Category["slug"]
}

const BrandProductsHeading = async ({ slug }: Props) => {

    const brand = await getBrand(slug)

    return (
        <section className="border-2 border-border px-3 py-5 space-y-3 rounded-lg">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <Link
                    href={"/brands"}
                    className={"text-muted-foreground hover:text-foreground"}
                >
                    Brands
                </Link>
                <span>&gt;</span>
                <Link
                    href={`/brands/${brand.slug}`}
                    className={"text-foreground font-semibold"}
                >
                    {brand.name}
                </Link>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-foreground text-2xl md:text-3xl font-bold">{brand.name}</h2>
            </div>
        </section>
    )
}

export default BrandProductsHeading