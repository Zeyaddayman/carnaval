
import Image from "next/image"
import Link from "next/link"
import SectionHeading from "../ui/SectionHeading"
import { getTopLevelCategories } from "@/server/db/categories"

const ExploreCollections = async () => {

    const topLevelCategories = await getTopLevelCategories()

    return (
        <section className="section-gap">
            <SectionHeading
                title="Explore Our Collections"
                subTitle="Discover something new every day."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {topLevelCategories.map((category) => (
                    <Link href={`/categories/${category.slug}`} key={category.id} className="flex flex-col border-border shadow-sm hover:shadow-lg hover:-translate-y-1 rounded-b-xl transition-all">
                        <div
                            className="relative w-full aspect-[3/2] "
                        >
                            <Image
                                src={category.thumbnail}
                                alt={category.name}
                                className="rounded-t-xl"
                                fill
                                sizes="(max-width: 768px) 95vw, (max-width: 1024px) 47vw, 32vw"
                                priority
                                quality={100}
                            />
                        </div>
                        <p className="text-center text-xl font-bold p-3 bg-card text-card-foreground">{category.name}</p>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default ExploreCollections