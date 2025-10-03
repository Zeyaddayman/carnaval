import Link from "next/link";
import { BsCartCheckFill } from "react-icons/bs";

export const InYourCart = ({ quantity }: { quantity: number }) => (
    <div className="flex gap-3 text-sm">
        <div className="p-3 flex gap-2 items-center bg-success text-success-foreground rounded-full">
            <BsCartCheckFill /> In your cart ({quantity})
        </div>
        <Link
            href={"/cart"}
            className="text-primary p-3"
        >
            View cart
        </Link>
    </div>
)