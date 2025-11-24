"use client"

import { UserSession } from "@/types/user"
import Link from "next/link"
import { Button, buttonVariants } from "../ui/Button"
import { usePathname, useRouter } from "next/navigation"
import { MdGridView } from "react-icons/md"
import { FiMapPin, FiShoppingBag } from "react-icons/fi"
import { IoExitOutline, IoSettingsOutline } from "react-icons/io5"
import { logoutAction } from "@/server/actions/auth"
import toast from "react-hot-toast"

const links = [
    { name: "Account Overview", href: "/profile", icon: <MdGridView size={20} /> },
    { name: "Orders", href: "/profile/orders", icon: <FiShoppingBag size={20} /> },
    { name: "Addresses", href: "/profile/addresses", icon: <FiMapPin size={20} /> },
    { name: "Settings", href: "/profile/settings", icon: <IoSettingsOutline size={20} /> },
]

interface Props {
    session: UserSession
}

const ProfileSidebar = ({ session }: Props) => {

    const pathname = usePathname()

    const router = useRouter()

    const isActiveLink = (href: string) => {
        return href.split("/").length > 2
            ? pathname.startsWith(href)
            : pathname === href
    }

    const logout = () => {
        logoutAction()
            .then(({ message }) => {
                toast.success(message)
            })
            .catch(() => {
                toast.error("Failed to logout")
            })
            .finally(() => {
                router.refresh()
            })
    }

    return (
        <aside className="w-fit lg:w-80 h-fit sticky top-5 bg-card border border-border shadow-sm p-3 rounded-md">
            <div className="py-4">
                <h2 className="font-semibold text-2xl truncate w-11 lg:w-auto">Hello, {session.name}</h2>
                <p className="text-muted-foreground text-sm truncate w-11 lg:w-auto">{session.email}</p>
            </div>
            <nav className="border-y border-border py-4 mb-4 space-y-2">
                {links.map(link => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`
                            ${buttonVariants({ variant: "ghost" })}
                            ${isActiveLink(link.href) ? "bg-secondary text-secondary-foreground" : ""}
                            !justify-start
                        `}
                    >
                        {link.icon} <div className="hidden lg:block">{link.name}</div>
                    </Link>
                ))}
            </nav>
            <Button
                variant={"destructive"}
                className="!w-full !justify-start"
                onClick={logout}
            >
                <IoExitOutline size={20} /> <div className="hidden lg:block">Logout</div>
            </Button>
        </aside>
    )
}

export default ProfileSidebar