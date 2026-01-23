import { buttonVariants } from "@/components/ui/Button"
import Image from "next/image"
import Link from "next/link"

const CheckoutSuccessPage = () => {
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
                        <h1 className="text-3xl font-bold mt-5 mb-3">Order Placed Successfully</h1>
                        <p className="text-muted-foreground my-3">Thanks for your purchase. Your order is on its way.</p>
                        <Link
                            href={"/profile/orders"}
                            className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                        >
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CheckoutSuccessPage