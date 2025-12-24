import { getBrands } from "@/server/db/brands"
import Image from "next/image"
import Link from "next/link"
import Heading from "../ui/Heading"

const ProductsBrands = async () => {

    const brands = await getBrands()

    return (
        <section>
            <Heading
                title="Explore Our Brands"
                subTitle="Discover products from your favorite brands."
            />
            <div className="flex flex-wrap justify-center gap-5">
                {brands.map(brand => (
                    <Link
                        key={brand.id}
                        href={`/brands/${brand.slug}`}
                        className="w-36 p-3 flex flex-col items-center justify-center gap-3 bg-card hover:bg-muted border border-border rounded-lg transition"
                    >
                        {brand.thumbnail && (
                            <Image
                                src={brand.thumbnail}
                                alt={`${brand.name} logo`}
                                width={118}
                                height={118}
                                className="rounded-md mix-blend-multiply"
                            />
                        )}
                        <div className="space-y-1 text-center">
                            <p className="text-foreground font-semibold">{brand.name}</p>
                            <p className="text-sm text-muted-foreground">{brand._count.products} products</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default ProductsBrands