import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    lang: Language
    translation: Translation["cart"]["emptyCart"]
}

const EmptyCart = ({ lang, translation }: Props) => {
    return (
        <div className="flex w-full h-[70vh] justify-center items-center">
            <div className="flex flex-col justify-center items-center text-center">
                <Image
                    src={"/images/empty-cart.svg"}
                    alt="Empty cart"
                    width={300}
                    height={250}
                    priority
                />
                <h1 className="text-3xl font-bold mt-5">{translation.title}</h1>
                <p className="text-muted-foreground my-3">{translation.subTitle}</p>
                <Link
                    href={`/${lang}/categories`}
                    className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                >
                    {translation.addItems}
                </Link>
            </div>
        </div>
    )
}

export default EmptyCart