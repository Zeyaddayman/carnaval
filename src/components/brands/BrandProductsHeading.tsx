import { Brand } from "@/generated/prisma"
import { Language } from "@/types/i18n"
import Link from "next/link"

interface Props {
    name: Brand["name"]
    slug: Brand["slug"]
    lang: Language
}

const BrandProductsHeading = ({ name, slug, lang }: Props) => {
    return (
        <section className="border-2 border-border px-3 py-5 space-y-3 rounded-lg">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <Link
                    href={`/${lang}/brands`}
                    className={"text-muted-foreground hover:text-foreground"}
                >
                    Brands
                </Link>
                <span>&gt;</span>
                <Link
                    href={`/${lang}/brands/${slug}`}
                    className={"text-foreground font-semibold"}
                >
                    {name}
                </Link>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-foreground text-2xl md:text-3xl font-bold">{name}</h2>
            </div>
        </section>
    )
}

export default BrandProductsHeading