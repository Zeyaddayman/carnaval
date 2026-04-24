import { buttonVariants } from "@/components/ui/Button"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"
import Image from "next/image"
import Link from "next/link"

const NotFound = async ({ params }: PageProps<"/[lang]">) => {

    const { lang } = await params

    const translation = await getTranslation(lang as Language)

    return (
        <main>
            <div className="container">
                <div className="flex w-full h-[70vh] justify-center items-center">
                    <div className="text-center">
                        <Image
                            src={"/images/not-found.svg"}
                            alt="Not found"
                            width={300}
                            height={199}
                            priority
                        />
                        <h1 className="text-3xl font-bold mt-5">{translation.notFound.title}</h1>
                        <p className="text-muted-foreground my-3">{translation.notFound.subTitle}</p>
                        <Link
                            href={`/${lang}`}
                            className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                        >
                            {translation.notFound.returnHome}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NotFound