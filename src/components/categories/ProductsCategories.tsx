import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { getTopLevelCategories } from "@/server/db/categories"
import Heading from "../ui/Heading"
import { MenuCategory } from "@/types/categories"
import Image from "next/image"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    lang: Language
    translation: Translation["categories"]
}

const ProductsCategories = async ({ lang, translation }: Props) => {

    const topLevelCategories = await getTopLevelCategories()

    return (
        <section>
            <Heading
                title={translation.title}
                subTitle={translation.subTitle}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {topLevelCategories.map(category => (
                    <div
                        key={category.slug}
                        className="p-5 pt-10 bg-card flex flex-col gap-3 border border-border rounded-xl"
                    >
                        <h4 className="font-semibold">{category.name}</h4>
                        <Subcategories subcategories={category.subcategories} lang={lang} />
                        <Link
                            href={`/${lang}/categories/${category.slug}`}
                            className={`${buttonVariants({ variant: "secondary", size: "lg" })} hover:bg-primary! hover:text-primary-foreground! w-full mt-auto`}
                        >
                            {translation.exploreAll}
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}

const Subcategories = ({ subcategories, lang }: { subcategories: MenuCategory["subcategories"], lang: Language }) => (
    <div className="grid grid-cols-2 gap-3">
        {subcategories.map(subcategory => (
            <Link
                key={subcategory.slug}
                href={`/${lang}/categories/${subcategory.slug}`}
                className=" p-3 hover:bg-muted rounded-lg transition-colors"
            >
                <div
                    className="relative w-full aspect-3/2"
                >
                    <Image
                        src={subcategory.thumbnail}
                        alt={subcategory.slug}
                        className="rounded-md"
                        fill
                        sizes="255px"
                    />
                </div>
                <p className="text-center text-sm mt-3">{subcategory.nameAsSubcategory}</p>
            </Link>
        ))}
    </div>
)

export default ProductsCategories