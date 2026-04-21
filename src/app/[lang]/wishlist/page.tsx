import Heading from "@/components/ui/Heading"
import WishlistItems from "@/components/wishlist/WishlistItems"
import { i18n } from "@/constants/i18n"
import { wishlistMetadata } from "@/metadata/wishlist"
import { isAuthenticated } from "@/server/utils/auth"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"
import { redirect } from "next/navigation"

export const metadata = wishlistMetadata

const WishlistPage = async ({ params }: PageProps<"/[lang]/wishlist">) => {

    const session = await isAuthenticated()

    if (!session) {
        redirect('/auth/login?redirect=/wishlist')
    }

    const { lang } = await params as { lang: Language }

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

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}

export default WishlistPage