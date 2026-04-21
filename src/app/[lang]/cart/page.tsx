import LocalCart from "@/components/cart/LocalCart"
import UserCart from "@/components/cart/UserCart"
import Heading from "@/components/ui/Heading"
import { i18n } from "@/constants/i18n"
import { cartMetadata } from "@/metadata/cart"
import { isAuthenticated } from "@/server/utils/auth"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"

export const metadata = cartMetadata

const CartPage = async ({ params }: PageProps<"/[lang]/cart">) => {

    const { lang } = await params as { lang: Language }

    const session = await isAuthenticated()

    const translation = await getTranslation(lang)

    return (
        <main>
            <div className="container">
                <Heading
                    title={translation.cart.title}
                />
                {session ? (
                    <UserCart
                        userId={session.userId}
                        lang={lang}
                        translation={translation}
                    />
                ): (
                    <LocalCart lang={lang} translation={translation} />
                )}
            </div>
        </main>
    )
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}

export default CartPage