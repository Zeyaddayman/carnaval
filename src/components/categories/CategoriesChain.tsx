import { categoryHierarchy } from "@/types/categories"
import Link from "next/link"
import { Fragment } from "react"

interface Props {
    categoryHierarchy: categoryHierarchy
}

const CategoriesChain = ({ categoryHierarchy }: Props) => {
    return (
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {categoryHierarchy.map((category, i) => {
                const isLastCategory = i === categoryHierarchy.length - 1
                return <Fragment key={category.name}>
                    <Link
                        href={category.link}
                        className={isLastCategory ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}
                    >
                        {i <= 1 ? category.name : category.subCategoryName}
                    </Link>
                    {!isLastCategory && <span>&gt;</span>}
                </Fragment>
            })}
        </div>
    )
}

export default CategoriesChain