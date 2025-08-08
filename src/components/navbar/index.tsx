import Link from "next/link"
import Links from "./Links"

const Navbar = () => {
    return (
        <nav className="bg-bar shadow-sm border-b border-border">
            <div className="container flex items-center justify-between gap-8 h-20">
                <Link href={"/"} className="text-xl font-bold text-foreground">
                    Carnaval
                </Link>

                <Links />
            </div>
        </nav>
    )
}

export default Navbar