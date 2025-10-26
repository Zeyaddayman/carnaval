import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { FiHeart, FiShoppingCart } from "react-icons/fi"
import { MdOutlineKeyboardArrowDown } from "react-icons/md"
import { Category } from "@/generated/prisma"
import { getTopLevelCategories } from "@/server/db/categories"
import { getBrands } from "@/server/db/brands"
import AuthLinks from "./AuthLinks"
import CartItemsCount from "./CartItemsCount"
import WishlistItemsCount from "./WishlistItemsCount"

const Links = async () => {

    const topLevelCategories = await getTopLevelCategories()

    const brands = await getBrands()

    return (
        <>
        <div className="relative group">
            <Link
                href={"/categories"}
                className={`${buttonVariants({ variant: "ghost" })}`}
            >
                Products Categories <MdOutlineKeyboardArrowDown className="hidden lg:inline" />
            </Link>
            {/* mega menu */}
            <ul
                className="absolute left-1/2 -translate-x-1/3 top-12 group-hover:top-9 hidden lg:grid grid-cols-4 gap-8 invisible group-hover:lg:visible opacity-0 group-hover:opacity-100 w-[800px] py-10 px-5 bg-card border border-border uppercase text-muted-foreground rounded-md shadow-md z-20 transition-all"
            >
                {topLevelCategories.map(category => (
                    <li key={category.id}>
                        <Link
                            href={`/categories/${category.slug}`}
                            className="block text-foreground hover:text-primary mb-3 font-semibold transition"
                        >
                            {category.name}
                        </Link>
                        <SubCategories subCategories={category.children} />
                    </li>
                ))}
            </ul>
        </div>
        <div className="relative group">
            <Link
                href={"/brands"}
                className={`${buttonVariants({ variant: "ghost" })}`}
            >
                Products Brands <MdOutlineKeyboardArrowDown className="hidden lg:inline" />
            </Link>
            <ul
                className="absolute left-1/2 -translate-x-1/2 top-12 group-hover:top-9 hidden lg:block invisible group-hover:lg:visible max-h-[400px] overflow-y-scroll space-y-3 [&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto py-5 px-3 bg-card border border-border text-muted-foreground rounded-md shadow-md z-20 transition-all"
            >
                {brands.map(brand => (
                    <li
                        key={brand.id}
                    >
                        <Link
                            href={`/brands/${brand.slug}`}
                            className="block py-2 hover:text-primary font-semibold transition"
                        >
                            {brand.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
        <Link
            href={"/cart"}
            className={`${buttonVariants({ variant: "ghost" })} relative`}
        >
            <span><FiShoppingCart size={20} /></span> Cart
            <CartItemsCount />
        </Link>
        <Link
            href={"/wishlist"}
            className={`${buttonVariants({ variant: "ghost" })} relative`}
        >
            <span><FiHeart size={20} /></span> Wishlist
            <WishlistItemsCount />
        </Link>
        <AuthLinks />
        </>
    )
}

const SubCategories = ({ subCategories }: { subCategories: Category[] }) => {
    return (
        <div className="flex flex-col gap-2">
            {subCategories.map(subCategory => (
                <Link
                    key={subCategory.id}
                    href={`/categories/${subCategory.slug}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                    {subCategory.subCategoryName || subCategory.name}
                </Link>
            ))}
        </div>
    )
}

export default Links