"use client"

import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import { FiUser } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { useGetUserSessionQuery } from "@/redux/features/userSessionApi";

const AuthLinks = () => {

    const { data: session, isLoading } = useGetUserSessionQuery()

    const pathname = usePathname()

    if (isLoading) return <LoadingSkeleton />

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
                className={`${buttonVariants({ variant: "primary" })}`}
            >
                Register
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