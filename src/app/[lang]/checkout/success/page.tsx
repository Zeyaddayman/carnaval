import { buttonVariants } from "@/components/ui/Button"
import { i18n } from "@/constants/i18n"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"
import Image from "next/image"
import Link from "next/link"

const CheckoutSuccessPage = async ({ params }: PageProps<"/[lang]/checkout/success">) => {

    const { lang } = await params

    const translation = await getTranslation(lang as Language)

    return (
        <main>
            <div className="container">
                <div className="flex w-full h-[70vh] justify-center items-center">
                    <div className="flex flex-col justify-center items-center text-center">
                        <Image
                            src={"/images/order-confirmed.svg"}
                            alt="Order Confirmed"
                            width={300}
                            height={228}
                            priority
                            fetchPriority="high"
                        />
                        <h1 className="text-3xl font-bold mt-5 mb-3">{translation.checkout.success.title}</h1>
                        <p className="text-muted-foreground my-3">{translation.checkout.success.subTitle}</p>
                        <Link
                            href={`/${lang}/profile/orders`}
                            className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                        >
                            {translation.checkout.success.viewOrders}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}

export default CheckoutSuccessPage