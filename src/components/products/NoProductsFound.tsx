import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "../ui/Button"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    clearFiltersLink: string
    lang: Language
    translation: Translation["products"]["noProductsFound"]
}

const NoProductsFound = ({ clearFiltersLink, lang, translation }: Props) => {
    return (
        <div className="flex justify-center items-center mt-10">
            <div className="text-center">
                <Image
                    src={"/images/no-data.svg"}
                    alt="No data"
                    className="mx-auto"
                    width={300}
                    height={293}
                    priority
                />
                <h1 className="text-3xl font-bold mt-5">{translation.title}</h1>
                <p className="text-muted-foreground my-3">{translation.subTitle}</p>
                <div className="flex flex-col gap-2">
                    <Link
                        href={`/${lang}/${clearFiltersLink}`}
                        className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                    >
                        {translation.clearFilters}
                    </Link>
                    <Link
                        href={`/${lang}/categories`}
                        className={`${buttonVariants({ variant: "secondary", size: "lg" })}`}
                    >
                        {translation.returnToCategories}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NoProductsFound