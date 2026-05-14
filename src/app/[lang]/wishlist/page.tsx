import Heading from "@/components/ui/Heading"
import WishlistItems from "@/components/wishlist/WishlistItems"
import { i18n } from "@/constants/i18n"
import { getWishlistMetadata } from "@/metadata/wishlist"
import { isAuthenticated } from "@/server/utils/auth"
import { Language } from "@/generated/prisma"
import getTranslation from "@/utils/translation"
import { redirect } from "next/navigation"

const WishlistPage = async ({ params }: PageProps<"/[lang]/wishlist">) => {

    const session = await isAuthenticated()

    const { lang } = await params as { lang: Language }

    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/wishlist`)
    }

    const translation = await getTranslation(lang)

    return (
        <main>
            <div className="container">
                <Heading
                    title={translation.wishlist.title}
                />
                <WishlistItems
                    userId={session.userId}
                    lang={lang}
                    translation={translation}
                />
            </div>
        </main>
    )
}

export async function generateMetadata({ params }: PageProps<"/[lang]/wishlist">) {
    const { lang } = await params as { lang: Language }

    return await getWishlistMetadata(lang)
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}

export default WishlistPage