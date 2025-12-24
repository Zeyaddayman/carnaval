import LocalCart from "@/components/cart/LocalCart"
import UserCart from "@/components/cart/UserCart"
import Heading from "@/components/ui/Heading"
import { cartMetadata } from "@/metadata/cart"
import { isAuthenticated } from "@/server/utils/auth"

export const metadata = cartMetadata

const CartPage = async () => {

    const session = await isAuthenticated()

    return (
        <main>
            <div className="container">
                <Heading
                    title="Shopping Cart"
                />
                {session ? (
                    <UserCart userId={session.userId} />
                ): (
                    <LocalCart />
                )}
            </div>
        </main>
    )
}

export default CartPage