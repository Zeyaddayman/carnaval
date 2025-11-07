import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "../ui/Button"

const EmptyWishlist = () => {
    return (
        <div className="flex w-full h-[70vh] justify-center items-center">
            <div className="flex flex-col justify-center items-center text-center">
                <Image
                    src={"/images/wishlist-item.svg"}
                    alt="empty-wishlist"
                    width={300}
                    height={233}
                />
                <h1 className="text-3xl font-bold mt-5">Your Wishlist is Empty!</h1>
                <p className="text-muted-foreground my-3">Start adding items you love by tapping on the heart icon .</p>
                <Link
                    href={"/categories"}
                    className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                >
                    Add Items
                </Link>
            </div>
        </div>
    )
}

export default EmptyWishlist