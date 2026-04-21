import { buttonVariants } from "@/components/ui/Button"
import { Language } from "@/types/i18n"
import { Translation } from "@/types/translation"
import Image from "next/image"
import Link from "next/link"

interface Props {
    lang: Language
    translation: Translation["profile"]["orders"]["noOrdersYet"]
}

const NoOrdersYet = ({ lang, translation }: Props) => {
    return (
        <div className="flex justify-center items-center mt-10">
            <div className="text-center">
                <Image
                    src={"/images/empty-order.svg"}
                    alt="Empty order"
                    className="mx-auto"
                    width={200}
                    height={150}
                    priority
                />
                <h1 className="text-2xl font-bold mt-5">{translation.title}</h1>
                <p className="text-muted-foreground my-3">{translation.subTitle}</p>
                <div className="flex flex-col gap-2">
                    <Link
                        href={`/${lang}/cart`}
                        className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                    >
                        {translation.viewCart}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NoOrdersYet