import Link from "next/link"
import Links from "./Links"
import LinksMenu from "./LinksMenu"
import SearchBar from "./SearchBar"
import { getTopLevelCategories } from "@/server/db/categories"
import { getBrands } from "@/server/db/brands"
import LanguageSwitcher from "./LanguageSwitcher"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

const Navbar = async ({ lang, translation }: { lang: Language, translation: Translation }) => {

    const [
        topLevelCategories,
        brands,

    ] = await Promise.all([getTopLevelCategories(), getBrands()])

    return (
        <nav role="navigation" className="bg-bar shadow-sm border-b border-border">
            <div className="container flex items-center justify-between gap-8 h-20">
                <Link href={`/${lang}`} className="text-xl font-bold text-foreground">
                    {translation.logo}
                </Link>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher lang={lang} />
                    <SearchBar
                        topLevelCategories={topLevelCategories}
                        lang={lang}
                        translation={translation.navbar.searchBar}
                    />
                    <LinksMenu
                        links={
                            <Links
                                topLevelCategories={topLevelCategories}
                                brands={brands}
                                lang={lang}
                                translation={translation.navbar.links}
                            />
                        }
                    />
                </div>
            </div>
        </nav>
    )
}

export default Navbar