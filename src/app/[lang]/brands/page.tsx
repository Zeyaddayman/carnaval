import ProductsBrands from "@/components/brands/ProductsBrands"
import { i18n } from "@/constants/i18n"
import { getBrandsMetadata } from "@/metadata/brands"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"

const BrandsPage = async ({ params }: PageProps<"/[lang]/brands">) => {

    const { lang } = await params as { lang: Language }

    const translation = await getTranslation(lang)

    return (
        <main>
            <div className="container">
                <ProductsBrands lang={lang} translation={translation.brands} />
            </div>
        </main>
    )
}

export async function generateMetadata({ params }: PageProps<"/[lang]/brands">) {
    const { lang } = await params as { lang: Language }

    return await getBrandsMetadata(lang)
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}

export default BrandsPage