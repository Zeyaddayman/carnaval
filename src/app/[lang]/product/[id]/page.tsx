import CategoriesChain from "@/components/categories/CategoriesChain"
import GoBack from "@/components/product/GoBack"
import ProductImagesPreview from "@/components/product/ProductImagesPreview"
import ProductInfo from "@/components/product/ProductInfo"
import WishlistAndCart from "@/components/product/WishlistAndCart"
import { db } from "@/lib/prisma"
import { getProduct } from "@/server/db/product"
import { notFound } from "next/navigation"
import { generateProductMetadata } from "@/metadata/product"
import getTranslation from "@/utils/translation"
import { Language } from "@/types/i18n"
import { i18n } from "@/constants/i18n"

export const revalidate = 3600

const productPage = async ({ params }: PageProps<"/[lang]/product/[id]">) => {

    const { id, lang } = await params as { id: string, lang: Language }

    const [data, translation] = await Promise.all([getProduct(id), getTranslation(lang)])

    if (!data) return notFound()

    const { product, categoryHierarchy } = data

    return (
        <main>
            <div className="container">
                <CategoriesChain lang={lang} categoryHierarchy={categoryHierarchy} />
                <div className="w-fit mt-2">
                    <GoBack text={translation.product.back} />
                </div>
                <div className="flex flex-col lg:flex-row gap-5 mt-5">
                    <ProductImagesPreview images={product.images} />
                    <div className="flex-1 space-y-6">
                        <ProductInfo product={product} />
                        <WishlistAndCart
                            product={product}
                            lang={lang}
                            translation={translation}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export const generateMetadata = async ({ params }: PageProps<"/[lang]/product/[id]">) => {

    const { id, lang } = await params as { id: string, lang: Language }

    const [data, translation] = await Promise.all([getProduct(id), getTranslation(lang)])

    if (!data) return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist or has been removed.'
    }

    const { product } = data

    return generateProductMetadata(product)
}

export async function generateStaticParams() {

    const params: { lang: Language, id: string }[] = []

    const allProducts = await db.product.findMany({
        select: { id: true }
    })

    i18n.languages.forEach(lang => {
        allProducts.forEach(({ id }) => params.push({ lang, id }))
    })

    return params
}

export default productPage