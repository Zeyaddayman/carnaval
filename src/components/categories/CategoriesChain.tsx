import { CategoryHierarchy } from "@/types/categories"
import Link from "next/link"
import { Fragment } from "react"

interface Props {
    categoryHierarchy: CategoryHierarchy
}

const CategoriesChain = ({ categoryHierarchy }: Props) => {
    return (
        <div className="space-x-3 overflow-x-auto whitespace-nowrap">
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