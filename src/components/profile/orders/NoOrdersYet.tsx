import { buttonVariants } from "@/components/ui/Button"
import Image from "next/image"
import Link from "next/link"

const NoOrdersYet = () => {
    return (
        <div className="flex justify-center items-center mt-10">
            <div className="text-center">
                <Image
                    src={"/images/empty-order.svg"}
                    alt="no-orders"
                    className="mx-auto"
                    width={200}
                    height={150}
                />
                <h1 className="text-2xl font-bold mt-5">No Orders Placed Yet!</h1>
                <p className="text-muted-foreground my-3">Let's make your first order.</p>
                <div className="flex flex-col gap-2">
                    <Link
                        href={"/cart"}
                        className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                    >
                        Cart
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NoOrdersYet