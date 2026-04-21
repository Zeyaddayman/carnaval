import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { FiHeart, FiShoppingCart } from "react-icons/fi"
import { MdOutlineKeyboardArrowDown } from "react-icons/md"
import AuthLinks from "./AuthLinks"
import CartItemsCount from "./CartItemsCount"
import WishlistItemsCount from "./WishlistItemsCount"
import { MenuCategory } from "@/types/categories"
import { BrandWithProductsCount } from "@/types/brands"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    topLevelCategories: MenuCategory[]
    brands: BrandWithProductsCount[]
    lang: Language
    translation: Translation["navbar"]["links"]
}

const Links = ({ topLevelCategories, brands, lang, translation }: Props) => {
    return (
        <>
        <div className="relative group">
            <Link
                href={`/${lang}/categories`}
                className={`${buttonVariants({ variant: "ghost" })}`}
            >
                {translation.categories} <MdOutlineKeyboardArrowDown className="hidden lg:inline" />
            </Link>
            <ul
                className="absolute -end-77 top-12 group-hover:top-9 hidden lg:grid grid-cols-4 gap-8 invisible group-hover:lg:visible opacity-0 group-hover:opacity-100 w-200 py-10 px-5 bg-card border border-border uppercase text-muted-foreground rounded-md shadow-md z-20 transition-all"
            >
                {topLevelCategories.map(category => (
                    <li key={category.slug}>
                        <Link
                            href={`/${lang}/categories/${category.slug}`}
                            className="block text-foreground hover:text-primary mb-3 font-semibold transition"
                        >
                            {category.name}
                        </Link>
                        <Subcategories subcategories={category.subcategories} lang={lang} />
                    </li>
                ))}
            </ul>
        </div>
        <div className="relative group">
            <Link
                href={`/${lang}/brands`}
                className={`${buttonVariants({ variant: "ghost" })}`}
            >
                {translation.brands} <MdOutlineKeyboardArrowDown className="hidden lg:inline" />
            </Link>
            <ul
                className="absolute left-1/2 -translate-x-1/2 top-12 group-hover:top-9 hidden lg:block invisible group-hover:lg:visible max-h-100 overflow-y-scroll space-y-3 [&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto py-5 px-3 bg-card border border-border text-muted-foreground rounded-md shadow-md z-20 transition-all"
            >
                {brands.map(brand => (
                    <li
                        key={brand.id}
                    >
                        <Link
                            href={`/${lang}/brands/${brand.slug}`}
                            className="block py-2 hover:text-primary font-semibold transition"
                        >
                            {brand.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
        <Link
            href={`/${lang}/cart`}
            className={`${buttonVariants({ variant: "ghost" })} relative`}
        >
            <span><FiShoppingCart className="rtl-flip" size={20} /></span>
            <CartItemsCount />
        </Link>
        <Link
            href={`/${lang}/wishlist`}
            className={`${buttonVariants({ variant: "ghost" })} relative`}
        >
            <span><FiHeart size={20} /></span>
            <WishlistItemsCount />
        </Link>
        <AuthLinks lang={lang} translation={translation} />
        </>
    )
}

const Subcategories = ({ subcategories, lang }: { subcategories: MenuCategory["subcategories"], lang: Language }) => {
    return (
        <div className="flex flex-col gap-2">
            {subcategories.map(subcategory => (
                <Link
                    key={subcategory.slug}
                    href={`/${lang}/categories/${subcategory.slug}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                    {subcategory.nameAsSubcategory}
                </Link>
            ))}
        </div>
    )
}

export default Links