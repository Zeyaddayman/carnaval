import Link from "next/link"

interface Category {
    name: string
    id: string
    slug: string
    _count: {
        products: number
    }
}

const Subcategories = async ({ categories }: { categories: Category[] }) => {

    if (categories.length === 0) return null

    return (
        <section className="h-fit border-2 lg:sticky top-5 border-border px-3 py-5 rounded-lg">
            <h5 className="text-muted-foreground text-l font-semibold mb-3">Subcategories</h5>
            <ul className="flex flex-row lg:flex-col overflow-x-auto gap-2">
                {categories.map((category) => (
                    <li
                        key={category.id}
                    >
                        <Link href={`/categories/${category.slug}`} className="flex justify-between items-center gap-3 bg-card p-3 border border-border rounded-md lg:max-w-50 whitespace-nowrap lg:whitespace-normal">
                            {category.name}
                            <span className="text-sm font-medium element-center w-9 h-9 bg-secondary text-secondary-foreground rounded-full">{category._count.products}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Subcategories