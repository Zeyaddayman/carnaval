"use client"

import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import { FiUser } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { useGetUserSessionQuery } from "@/redux/features/userSessionApi";
import { Translation } from "@/types/translation";
import { Language } from "@/types/i18n";

interface Props {
    lang: Language
    translation: Translation["navbar"]["links"]
}

const AuthLinks = ({ lang, translation }: Props) => {

    const { data: session, isLoading } = useGetUserSessionQuery()

    const pathname = usePathname()

    if (isLoading) return <LoadingSkeleton />

    return (
        <>
        {session ? (
            <>
            {session.role === "ADMIN" && (
                <Link
                    href={`/${lang}/admin`}
                    className={`${buttonVariants({ variant: "ghost" })}`}
                >
                    <RiAdminLine size={20} />
                </Link>
            )}
            <Link
                href={`/${lang}/profile`}
                className={`${buttonVariants({ variant: "ghost" })}`}
            >
                <FiUser size={20} />
            </Link>
            </>
        ) : (
            <>
            <Link
                href={`/${lang}/auth/login?redirect=${pathname}`}
                className={`${buttonVariants({ variant: "primary" })}`}
            >
                {translation.login}
            </Link>
            <Link
                href={`/${lang}/auth/register?redirect=${pathname}`}
                className={`${buttonVariants({ variant: "secondary" })}`}
            >
                {translation.register}
            </Link>
            </>
        )}
        </>
    )
}

const LoadingSkeleton = () => (
    <div role={"status"} className="bg-gray-200 min-w-24 h-9 animate-pulse rounded-md"></div>
)

export default AuthLinks