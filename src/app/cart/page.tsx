import UserCart from "@/components/cart/UserCart"
import Heading from "@/components/ui/Heading"
import { isAuthenticated } from "@/server/db/auth"

const CartPage = async () => {

    const session = await isAuthenticated()

    return (
        <main>
            <div className="container">
                <Heading
                    title="Shopping Cart"
                />
                {session && (
                    <UserCart userId={session.userId} />
                )}
            </div>
        </main>
    )
}

export default CartPage