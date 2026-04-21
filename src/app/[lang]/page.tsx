import ExploreCollections from "@/components/home/ExploreCollections"
import Hero from "@/components/home/Hero"
import { i18n } from "@/constants/i18n"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"

export default async function Home({ params }: PageProps<"/[lang]">) {

    const { lang } = await params as { lang: Language }

    const translation = await getTranslation(lang)

    return (
        <main>
            <div className="container">
                <Hero lang={lang} translation={translation.home.hero} />
                <ExploreCollections lang={lang} translation={translation.home.exploreCollections} />
            </div>
        </main>
    )
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}