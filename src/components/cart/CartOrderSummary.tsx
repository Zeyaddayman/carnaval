import { Button } from "../ui/Button"

const CartOrderSummary = () => {
    return (
        <div className="min-w-80 sticky top-5 h-fit rounded-md border border-border bg-card p-4 shadow-sm">
            <h4 className="font-semibold text-xl pb-3 border-b border-border">Order Summary</h4>
            <div className="space-y-2 my-3">
                <p className="flex justify-between items-center flex-wrap">items <span>12</span></p>
                <p className="flex justify-between items-center flex-wrap">Subtotal <span>$312</span></p>
                <p className="flex justify-between items-center flex-wrap">Discounts <span>-$20</span></p>
                <p className="flex justify-between items-center flex-wrap">Shipping <span className="text-success">Free</span></p>
            </div>
            <p className="flex justify-between items-center text-2xl font-semibold flex-wrap py-3 border-y border-border">Total <span>$400</span></p>
            <Button
                variant={"primary"}
                size={"lg"}
                className="w-full mt-4"
            >
                Checkout
            </Button>
        </div>
    )
}

export default CartOrderSummary