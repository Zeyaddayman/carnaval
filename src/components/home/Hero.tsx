import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    lang: Language
    translation: Translation["home"]["hero"]
}

const Hero = ({ lang, translation }: Props) => {
    return (
        <section className="min-h-[75vh] bg-secondary element-center flex-col gap-8 px-4 md:px-20 py-4 text-center rounded-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">{translation.heading}</h1>
            <p className="text-xl text-secondary-foreground">{translation.description}</p>
            <Link
                href={`/${lang}/categories`}
                className={`${buttonVariants({ variant: "primary", size: "lg" })} w-fit mx-auto`}
            >
                {translation.shopNow}
            </Link>
        </section>
    )
}

export default Hero