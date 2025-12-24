import Heading from "@/components/ui/Heading"
import WishlistItems from "@/components/wishlist/WishlistItems"
import { wishlistMetadata } from "@/metadata/wishlist"
import { isAuthenticated } from "@/server/utils/auth"
import { redirect } from "next/navigation"

export const metadata = wishlistMetadata

const WishlistPage = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect('/auth/login?redirect=/wishlist')
    }

    return (
        <main>
            <div className="container">
                <Heading
                    title="Wishlist"
                />
                <WishlistItems userId={session.userId} />
            </div>
        </main>
    )
}

export default WishlistPage