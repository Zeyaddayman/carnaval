"use client"

import { Button, buttonVariants } from "@/components/ui/Button"
import Image from "next/image"
import Link from "next/link"

const Error = ({ reset }: { reset: () => void }) => {
    return (
        <main>
            <div className="container">
                <div className="flex w-full h-[70vh] justify-center items-center">
                    <div className="flex flex-col justify-center items-center text-center">
                        <Image
                            src={"/images/error.svg"}
                            alt="not-found"
                            width={300}
                            height={162}
                        />
                        <h1 className="text-3xl font-bold mt-5 mb-3">Something Went Wrong!</h1>
                        <div className="flex gap-2 justify-center">
                            <Link
                                href={"/"}
                                className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                            >
                                Home
                            </Link>
                            <Button
                                variant={"secondary"}
                                size={"lg"}
                                onClick={reset}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Error