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
import { useTransition } from "react"
import { useAppDispatch } from "@/redux/hooks"
import { userSessionApi } from "@/redux/features/userSessionApi"
import { Language } from "@/types/i18n"
import { Translation } from "@/types/translation"
import { inject } from "@/utils/translation"

interface Props {
    session: UserSession
    lang: Language
    translation: Translation["profile"]
}

const ProfileSidebar = ({ session, lang, translation }: Props) => {

    const pathname = usePathname()

    const router = useRouter()

    const [isLoggingOut, startLoggingOut] = useTransition()

    const dispatch = useAppDispatch()

    const links = [
        { name: translation.links.accountOverview, href: "profile", icon: <MdGridView size={20} /> },
        { name: translation.links.orders, href: "profile/orders", icon: <FiShoppingBag size={20} /> },
        { name: translation.links.addresses, href: "profile/addresses", icon: <FiMapPin size={20} /> },
        { name: translation.links.settings, href: "profile/settings", icon: <IoSettingsOutline size={20} /> },
    ]

    const isActiveLink = (href: string) => {
        return href.split("/").length > 3
            ? pathname.includes(href)
            : pathname === href
    }

    const logout = () => {

        startLoggingOut(async () => {
            try {
                const { status, message } = await logoutAction()

                if (status === 200) toast.success(message)

                else toast.error(message)
            }
            catch {
                toast.error("Failed to logout")
            }
            finally {
                dispatch(userSessionApi.util.invalidateTags(['user-session']))
                router.replace("/")
            }
        })
    }

    return (
        <aside className="w-fit lg:w-80 h-fit sticky top-5 bg-card border border-border shadow-sm p-3 rounded-md">
            <div className="py-4">
                <h2 className="font-semibold text-2xl truncate w-11 lg:w-auto">
                    {inject(translation.greeting, { name: session.name })}
                </h2>
                
                <p className="text-muted-foreground text-sm truncate w-11 lg:w-auto">{session.email}</p>
            </div>
            <nav className="border-y border-border py-4 mb-4 space-y-2">
                {links.map(link => (
                    <Link
                        key={link.name}
                        href={`/${lang}/${link.href}`}
                        className={`
                            ${buttonVariants({ variant: "ghost" })}
                            ${isActiveLink(`/${lang}/${link.href}`) ? "bg-secondary text-secondary-foreground" : ""}
                            justify-start!
                        `}
                    >
                        {link.icon} <div className="hidden lg:block">{link.name}</div>
                    </Link>
                ))}
            </nav>
            <Button
                variant={"destructive"}
                className="w-full justify-start"
                onClick={logout}
                disabled={isLoggingOut}
            >
                <IoExitOutline size={20} /> {isLoggingOut ? (
                    <div className="hidden lg:block">{translation.loggingOut}</div>
                ) : (
                    <div className="hidden lg:block">{translation.logout}</div>
                )
            }
            </Button>
        </aside>
    )
}

export default ProfileSidebar