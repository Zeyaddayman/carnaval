"use client"

import { FaPlus } from "react-icons/fa"
import { Button } from "../ui/Button"
import { useState } from "react"
import Dialog from "../ui/Dialog"
import AddNewAddressForm from "../profile/addresses/AddNewAddressForm"

interface Props {
    userName: string
    userPhone: string
    isFirstAddress: boolean
}

const CheckoutAddAddressButton = ({ userName, userPhone, isFirstAddress }: Props) => {

    const [isOpen, setIsOpen] = useState(false)

    const close = () => setIsOpen(false)
    const open = () => setIsOpen(true)

    return (
        <>
        {isFirstAddress ? (
            <Button
                variant={"primary"}
                size={"lg"}
                className="w-full"
                onClick={open}
            >
                <FaPlus /> ADD YOUR ADDRESS
            </Button>
        ): (
            <Button
                variant={"outline"}
                className="w-full bg-white border-border"
                onClick={open}
            >
                <FaPlus /> Add New Address
            </Button>
        )}
        <Dialog
            isOpen={isOpen}
            close={close}
            title={isFirstAddress ? "Add Your Address": "Add New Address"}
        >
            <AddNewAddressForm
                userName={userName}
                userPhone={userPhone}
                isFirstAddress={isFirstAddress}
                close={close}
                setDefaultChecked={true}
            />
        </Dialog>
        </>
    )
}

export default CheckoutAddAddressButton