"use client"

import { Button, buttonVariants } from "@/components/ui/Button"
import { Translation } from "@/types/translation"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const Error = ({ reset }: { reset: () => void }) => {

    const { lang } = useParams()

    const [text, setText] = useState<Translation["error"] | null>(null)

    useEffect(() => {
        fetch(`/api/translate/error/${lang}`)
            .then(res => res.json())
            .then(translation => setText(translation))
    }, [])

    return (
        <main>
            <div className="container">
                <div className="flex w-full h-[70vh] justify-center items-center">
                    <div className="flex flex-col justify-center items-center text-center">
                        <Image
                            src={"/images/error.svg"}
                            alt="Error"
                            width={300}
                            height={162}
                        />
                        <h1 className="text-3xl font-bold mt-5 mb-3">{text?.title}</h1>
                        <div className="flex gap-2 justify-center">
                            <Link
                                href={"/"}
                                className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                            >
                                {text?.home}
                            </Link>
                            <Button
                                variant={"secondary"}
                                size={"lg"}
                                onClick={reset}
                            >
                                {text?.tryAgain}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Error