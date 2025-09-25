"use client"

import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import { FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { UserSession } from "@/types/user";
import { checkIsAuthenticated } from "@/server/actions/auth";
import { RiAdminLine } from "react-icons/ri";
import { usePathname } from "next/navigation";

const AuthLinks = ({ refreshKey }: { refreshKey: number }) => {

    const [session, setSession] = useState<UserSession | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        checkIsAuthenticated().then(user => setSession(user))
    }, [refreshKey])

    return (
        <>
        {session ? (
            <>
            {session.role === "ADMIN" && (
                <Link
                    href={"/admin"}
                    className={`${buttonVariants({ variant: "ghost" })}`}
                >
                    <RiAdminLine size={20} /> Admin
                </Link>
            )}
            <Link
                href={"/profile"}
                className={`${buttonVariants({ variant: "ghost" })}`}
            >
                <FiUser size={20} /> Profile
            </Link>
            </>
        ) : (
            <>
            <Link
                href={`/auth/login?redirect=${pathname}`}
                className={`${buttonVariants({ variant: "secondary" })}`}
            >
                Login
            </Link>
            <Link
                href={`/auth/register?redirect=${pathname}`}
                className={`${buttonVariants({ variant: "default" })}`}
            >
                Register
            </Link>
            </>
        )}
        </>
    )
}

export default AuthLinks