import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "../ui/Button"

const EmptyCart = () => {
    return (
        <div className="flex w-full h-[70vh] justify-center items-center">
            <div className="flex flex-col justify-center items-center text-center">
                <Image
                    src={"/images/empty-cart.svg"}
                    alt="empty-cart"
                    width={300}
                    height={162}
                />
                <h1 className="text-3xl font-bold mt-5">Your Cart is Empty!</h1>
                <p className="text-muted-foreground my-3">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    href={"/categories"}
                    className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                >
                    Shop Now
                </Link>
            </div>
        </div>
    )
}

export default EmptyCart