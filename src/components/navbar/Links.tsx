import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { FiHeart, FiShoppingCart, FiUser } from "react-icons/fi"
import { MdOutlineKeyboardArrowDown } from "react-icons/md"
import { getCachedTopLevelCategories } from "@/server/cache"
import { Category } from "@/generated/prisma"

const Links = async () => {

    const topLevelCategories = await getCachedTopLevelCategories()
    const isAuthenticated = true

    return (
        <div className="lg:flex items-center hidden gap-3 text-bar-foreground">
            <Link
                href={"/cart"}
                className={`${buttonVariants({ variant: "ghost" })} relative`}
            >
                <span><FiShoppingCart size={20} /></span>
                <span className="absolute w-6 h-6 element-center -top-2 -right-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">12</span>
            </Link>
            <Link
                href={"/wishlist"}
                className={`${buttonVariants({ variant: "ghost" })} relative`}
            >
                <span><FiHeart size={20} /></span>
                <span className="absolute w-6 h-6 element-center -top-2 -right-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full">43</span>
            </Link>
            <div className="relative group">
                <Link
                    href={"/categories"}
                    className={`${buttonVariants({ variant: "ghost" })}`}
                >
                    Products Categories <MdOutlineKeyboardArrowDown />
                </Link>
                <ul
                    className="absolute hidden group-hover:grid grid-cols-4 gap-8 top-18 group-hover:top-9 left-1/2 -translate-x-1/2 w-[800px] z-20 py-10 px-5 bg-card border border-border uppercase text-muted-foreground rounded-md shadow-md"
                >
                    {topLevelCategories.map(category => (
                        <li key={category.id}>
                            <Link
                                href={`/categories/${category.slug}`}
                                className="block text-foreground hover:text-primary mb-3 font-semibold transition"
                            >
                                {category.name}
                            </Link>
                            <SubCategories categories={category.children} />
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
        </div>
    )
}

const AuthLinks = () => (
    <>
    <Link
        href={"/login"}
        className={`${buttonVariants({ variant: "secondary" })}`}
    >
        Login
    </Link>
    <Link
        href={"/register"}
        className={`${buttonVariants({ variant: "default" })}`}
    >
        Register
    </Link>
    </>
)

const SubCategories = ({ categories }: { categories: Category[] }) => {
    return (
        <div className="flex flex-col gap-2">
            {categories.map(subCategory => (
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