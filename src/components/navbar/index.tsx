import Link from "next/link"
import Links from "./Links"
import LinksMenu from "./LinksMenu"
import SearchBar from "./SearchBar"
import { getTopLevelCategories } from "@/server/db/categories"
import { getBrands } from "@/server/db/brands"

const Navbar = async () => {

    const [topLevelCategories, brands] = await Promise.all([getTopLevelCategories(), getBrands()])

    return (
        <nav role="navigation" className="bg-bar shadow-sm border-b border-border">
            <div className="container flex items-center justify-between gap-8 h-20">
                <Link href={"/"} className="text-xl font-bold text-foreground">
                    Carnaval
                </Link>
                <div className="flex items-center gap-3">
                    <SearchBar
                        topLevelCategories={topLevelCategories}
                    />
                    <LinksMenu links={<Links topLevelCategories={topLevelCategories} brands={brands} />} />
                </div>
            </div>
        </nav>
    )
}

export default Navbar