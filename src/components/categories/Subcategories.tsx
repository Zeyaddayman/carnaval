import { Category } from "@/generated/prisma"
import { getSubcategories } from "@/server/db/categories"
import Link from "next/link"

interface Props {
    slug: Category["slug"]
}

const Subcategories = async ({ slug }: Props) => {

    const subcategories = await getSubcategories(slug)

    if (subcategories.length === 0) return null

    return (
        <section className="border-2 border-border px-3 py-5 rounded-lg">
            <h5 className="text-muted-foreground text-l font-semibold mb-3">Subcategories</h5>
            <ul className="flex flex-row md:flex-col overflow-x-scroll md:overflow-x-auto gap-2">
                {subcategories.map((subcategory) => (
                    <li
                        key={subcategory.id}
                    >
                        <Link href={`/categories/${subcategory.slug}`} className="flex justify-between items-center gap-3 bg-card p-3 border border-border rounded-md whitespace-nowrap">
                            {subcategory.name}
                            <span className="text-sm font-medium element-center w-9 h-9 bg-secondary text-secondary-foreground rounded-full">{subcategory._count.products}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Subcategories