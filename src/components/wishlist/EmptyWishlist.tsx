import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    lang: Language
    translation: Translation["wishlist"]["emptyWishlist"]
}

const EmptyWishlist = ({ lang, translation }: Props) => {
    return (
        <div className="flex w-full h-[70vh] justify-center items-center">
            <div className="flex flex-col justify-center items-center text-center">
                <Image
                    src={"/images/wishlist-item.svg"}
                    alt="Wishlist item"
                    width={300}
                    height={233}
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

export default EmptyWishlist