import { CategoryHierarchy } from "@/types/categories"
import Link from "next/link"
import { Fragment } from "react"

interface Props {
    categoryHierarchy: CategoryHierarchy
}

const CategoriesChain = ({ categoryHierarchy }: Props) => {
    return (
        <div className="space-x-3 overflow-x-auto whitespace-nowrap pb-2">
            {categoryHierarchy.map((category, i) => {

                const isFirstCategory = i <= 1
                const isLastCategory = i === categoryHierarchy.length - 1

                return <Fragment key={category.name}>
                    <Link
                        href={category.link}
                        className={isLastCategory ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}
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