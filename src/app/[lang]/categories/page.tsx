import ProductsCategories from "@/components/categories/ProductsCategories"
import { i18n } from "@/constants/i18n"
import { getCategoriesMetadata } from "@/metadata/categories"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"

const CategoriesPage = async ({ params }: PageProps<"/[lang]/categories">) => {

    const { lang } = await params as { lang: Language }

    const translation = await getTranslation(lang)

    return (
        <main>
            <div className="container">
                <ProductsCategories lang={lang} translation={translation.categories} />
            </div>
        </main>
    )
}

export async function generateMetadata({ params }: PageProps<"/[lang]/categories">) {

    const { lang } = await params as { lang: Language }

    return await getCategoriesMetadata(lang)
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}

export default CategoriesPage