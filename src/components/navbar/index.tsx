import Link from "next/link"
import Links from "./Links"
import LinksMenu from "./LinksMenu"

const Navbar = () => {
    return (
        <nav role="navigation" className="bg-bar shadow-sm border-b border-border">
            <div className="container flex items-center justify-between gap-8 h-20">
                <Link href={"/"} className="text-xl font-bold text-foreground">
                    Carnaval
                </Link>
                
                <LinksMenu links={<Links />} />
            </div>
        </nav>
    )
}

export default Navbar