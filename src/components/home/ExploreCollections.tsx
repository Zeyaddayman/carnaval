import { getCachedTopLevelCategories } from "@/server/cache"
import Image from "next/image"
import Link from "next/link"

const ExploreCollections = async () => {

    const topLevelCategories = await getCachedTopLevelCategories()

    return (
        <section className="section-gap">
            <div className="container text-center">
                <h2 className="text-foreground text-3xl font-bold mb-2">Explore Our Collections</h2>
                <p className="text-muted-foreground mb-8">Discover something new every day.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topLevelCategories.map((category) => (
                        <Link href={`/categories/${category.slug}`} key={category.id} className="flex flex-col border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div
                                className="relative w-full aspect-[3/2] "
                            >
                                <Image
                                    src={category.thumbnail}
                                    alt={category.name}
                                    className="rounded-t-lg"
                                    fill
                                    sizes="(max-width: 768px) 95vw, (max-width: 1024px) 47vw, 32vw"
                                    priority
                                    quality={100}
                                />
                            </div>
                            <p className="text-center text-xl font-bold p-3 bg-card text-card-foreground rounded-b-lg">{category.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ExploreCollections