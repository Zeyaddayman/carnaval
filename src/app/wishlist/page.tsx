import Heading from "@/components/ui/Heading"
import WishlistItems from "@/components/wishlist/WishlistItems"
import { isAuthenticated } from "@/server/db/auth"
import { redirect } from "next/navigation"

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