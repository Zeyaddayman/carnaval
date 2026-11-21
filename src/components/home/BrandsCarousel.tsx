import { Language } from "@/generated/prisma"
import { getBrands } from "@/server/db/brands"
import Image from "next/image"

interface Props {
    lang: Language
}

const BrandsCarousel = async ({ lang }: Props) => {

    const brands = await getBrands(lang)

    const brandsWithImages = brands.filter(brand => brand.thumbnail)

    const brandsCount = brandsWithImages.length
    const brandLogoWidth = 80 // in pixels
    const gap = 32 // in pixels

    const dir = lang === "ar" ? "RTL" : "LTR"

    return (
        <section className="section-gap">
            <div
                className="brands-carousel-wrapper overflow-hidden"
                style={{
                    // reverse direction for RTL languages
                    '--brands-count': `${dir === "LTR" ? "-" : ""}${brandsCount}`,
                    '--brand-logo-width': `${brandLogoWidth}px`,
                    '--gap': `${gap}px`
                }}
            >
                <ul
                    className="brands-carousel flex gap-8"
                    style={{ animation: `scroll ${brandsCount}s infinite linear` }}
                >
                    {brandsWithImages.map(brand => (
                        <li key={brand.slug}
                            className="shrink-0 w-fit"
                        >
                            <Image
                                src={brand.thumbnail!}
                                alt={`${brand.name} logo`}
                                width={80}
                                height={80}
                            />
                        </li>
                    ))}
                    {brandsWithImages.map(brand => (
                        <li key={`${brand.slug} 2`}
                            className="shrink-0 w-fit"
                            aria-hidden="true"
                        >
                            <Image
                                src={brand.thumbnail!}
                                alt={`${brand.name} 2 logo`}
                                width={80}
                                height={80}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default BrandsCarousel