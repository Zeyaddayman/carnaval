import { getBrands } from "@/server/db/brands"
import Image from "next/image"
import Link from "next/link"

const ProductsBrands = async () => {

    const brands = await getBrands()

    return (
        <div className="container flex flex-wrap justify-center gap-5">
            {brands.map(brand => (
                <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    className="w-36 p-3 flex flex-col items-center justify-center gap-3 bg-card hover:bg-muted border border-border rounded-lg transition"
                >
                    {brand.thumbnail && (
                        <div className="relative w-33 h-33">
                            <Image
                                src={brand.thumbnail}
                                alt={brand.name}
                                fill
                                className="rounded-md mix-blend-multiply"
                            />
                        </div>
                    )}
                    <div className="space-y-1 text-center">
                        <p className="text-foreground font-semibold">{brand.name}</p>
                        <p className="text-sm text-muted-foreground">{brand._count.products} products</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default ProductsBrands