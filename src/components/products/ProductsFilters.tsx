"use client"

import { useState } from "react"
import { Button } from "../ui/Button"
import Dialog from "../ui/Dialog"
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"

const ProductsFilters = () => {

    const [isOpen, setIsOpen] = useState(false)

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    return (
        <div>
            <Button
                onClick={open}
            >
                <HiOutlineAdjustmentsHorizontal size={20} /> Open Filters
            </Button>
            <Dialog
                isOpen={isOpen}
                close={close}
                title="Filter Products"
            >
                <div className="flex justify-between items-center mt-4">
                    <Button
                        className="bg-white text-foreground hover:bg-white/80"
                        onClick={close}
                    >
                        Reset Filters
                    </Button>
                    <Button
                        onClick={close}
                    >
                        Apply Filters
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ProductsFilters