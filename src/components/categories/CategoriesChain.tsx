import { CategoryHierarchy } from "@/types/categories"
import { Language } from "@/generated/prisma"
import Link from "next/link"
import { Fragment } from "react"

interface Props {
    categoryHierarchy: CategoryHierarchy
    lang: Language
}

const CategoriesChain = ({ categoryHierarchy, lang }: Props) => {
    return (
        <div className="overflow-x-auto whitespace-nowrap pb-2">
            {categoryHierarchy.map((category, i) => {

                const isFirstCategory = i <= 1
                const isLastCategory = i === categoryHierarchy.length - 1

                return <Fragment key={category.name}>
                    <Link
                        href={`/${lang}${category.link}`}
                        className={isLastCategory ? "text-foreground font-semibold ms-3" : `text-muted-foreground hover:text-foreground me-3 ${i !== 0 ? "ms-3" : ""}`}
                    >
                        {isFirstCategory ? category.name : category.nameAsSubcategory}
                    </Link>
                    {!isLastCategory && <span>&gt;</span>}
                </Fragment>
            })}
        </div>
    )
}

export default CategoriesChain