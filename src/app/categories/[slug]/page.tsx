import CategoryProductsHeading from "@/components/categories/CategoryProductsHeading"

interface Props {
    params: Promise<Record<string, string>>
}

const CategoryProductsPage = async ({ params }: Props) => {

    const { slug } = await params

    return (
        <main>
            <div className="container">
                <CategoryProductsHeading slug={slug} />
            </div>
        </main>
    )
}

export default CategoryProductsPage