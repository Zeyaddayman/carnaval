import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi"
import { MdOutlineKeyboardArrowDown } from "react-icons/md"
import { Category } from "@/generated/prisma"
import { getTopLevelCategories } from "@/server/db/categories"
import { getBrands } from "@/server/db/brands"

const Links = async () => {

    const topLevelCategories = await getTopLevelCategories()

    const brands = await getBrands()
    
    const isAuthenticated = false

    return (
        <>
        <Link
            href={"/cart"}
            className={`${buttonVariants({ variant: "ghost" })} relative`}
        >
            <span><FiShoppingCart size={20} /></span> Cart
            <span className="absolute w-6 h-6 element-center -top-2 -left-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">12</span>
        </Link>
        <Link
            href={"/wishlist"}
            className={`${buttonVariants({ variant: "ghost" })} relative`}
        >
            <span><FiHeart size={20} /></span> Wishlist
            <span className="absolute w-6 h-6 element-center -top-2 -left-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">43</span>
        </Link>
        <div className="relative group">
            <Link
                href={"/categories"}
                className={`${buttonVariants({ variant: "ghost" })}`}
            >
                Products Categories <MdOutlineKeyboardArrowDown className="hidden lg:inline" />
            </Link>
            {/* mega menu */}
            <ul
                className="absolute left-0 -translate-x-2/5 top-12 group-hover:top-9 hidden lg:grid grid-cols-4 gap-8 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto w-[800px] py-10 px-5 bg-card border border-border uppercase text-muted-foreground rounded-md shadow-md z-20 transition-all"
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
                className="absolute left-1/2 -translate-x-1/2 top-12 group-hover:top-9 hidden lg:block max-h-[400px] overflow-y-scroll space-y-3 [&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto py-5 px-3 bg-card border border-border text-muted-foreground rounded-md shadow-md z-20 transition-all"
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
        {!isAuthenticated ? <AuthLinks /> : (
            <Link
                href={"/profile"}
                className={`${buttonVariants({ variant: "ghost" })}`}
            >
                <FiUser size={20} /> Profile
            </Link>
        )}
        </>
    )
}

const AuthLinks = () => (
    <>
    <Link
        href={"/auth/login"}
        className={`${buttonVariants({ variant: "secondary" })}`}
    >
        Login
    </Link>
    <Link
        href={"/auth/register"}
        className={`${buttonVariants({ variant: "default" })}`}
    >
        Register
    </Link>
    </>
)

const SubCategories = ({ subCategories }: { subCategories: Category[] }) => (
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

export default Links