"use client"

import { Button } from "@/components/ui/Button"
import Dialog from "@/components/ui/Dialog"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import AddNewAddressForm from "./AddNewAddressForm"

interface Props {
    userName: string,
    userPhone: string,
    isFirstAddress: boolean
}

const AddNewAddressButton = ({ userName, userPhone, isFirstAddress }: Props) => {

    const [isOpen, setIsOpen] = useState(false)

    const close = () => setIsOpen(false)
    const open = () => setIsOpen(true)

    return (
        <div className="mt-10 flex justify-center">
            <Button
                variant={"primary"}
                size={isFirstAddress ? "lg" : "default"}
                onClick={open}
            >
                <FaPlus /> {isFirstAddress ? "ADD YOUR ADDRESS" : "Add New Address"}
            </Button>
            <Dialog
                isOpen={isOpen}
                close={close}
                title={isFirstAddress ? "Add Your Address" : "Add New Address"}
            >
                <AddNewAddressForm
                    userName={userName}
                    userPhone={userPhone}
                    isFirstAddress={isFirstAddress}
                    close={close}
                />
            </Dialog>
        </div>
    )
}

export default AddNewAddressButton