import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { Category } from "@/generated/prisma"
import Image from "next/image"
import { getTopLevelCategories } from "@/server/db/categories"
import Heading from "../ui/Heading"

const ProductsCategories = async () => {

    const topLevelCategories = await getTopLevelCategories()

    return (
        <section>
            <Heading
                title="All Products Categories"
                subTitle="Browse our extensive collection of products by category."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {topLevelCategories.map(category => (
                    <div
                        key={category.id}
                        className="p-5 pt-10 bg-card flex flex-col gap-3 border border-border rounded-xl"
                    >
                        <h4 className="font-semibold">{category.name}</h4>
                        <SubCategories subCategories={category.children} />
                        <Link
                            href={`/categories/${category.slug}`}
                            className={`${buttonVariants({ variant: "secondary", size: "lg" })} hover:!bg-primary hover:!text-primary-foreground w-full mt-auto`}
                        >
                            Explore all products
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}

const SubCategories = ({ subCategories }: { subCategories: Category[] }) => (
    <div className="grid grid-cols-2 gap-3">
        {subCategories.map(subCategory => (
            <Link
                key={subCategory.id}
                href={`/categories/${subCategory.slug}`}
                className="p-3 hover:bg-muted rounded-lg transition-all"
            >
                <div
                    className="relative w-full aspect-[3/2] "
                >
                    <Image
                        src={subCategory.thumbnail}
                        alt={subCategory.name}
                        className="rounded-md"
                        fill
                        sizes="(max-width: 768px) 253px, 120px"
                        quality={100}
                    />
                </div>
                <p className="text-center mt-3">{subCategory.subCategoryName}</p>
            </Link>
        ))}
    </div>
)

export default ProductsCategories