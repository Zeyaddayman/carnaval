"use client"

import { FaPlus } from "react-icons/fa"
import { Button } from "../ui/Button"
import { useState } from "react"
import Dialog from "../ui/Dialog"
import AddNewAddressForm from "../profile/addresses/AddNewAddressForm"
import { Translation } from "@/types/translation"

interface Props {
    userName: string
    userPhone: string
    isFirstAddress: boolean
    translation: Translation["profile"]["addresses"]
}

const CheckoutAddAddressButton = ({ userName, userPhone, isFirstAddress, translation }: Props) => {

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
                <FaPlus /> {translation.addYourAddressCaps}
            </Button>
        ): (
            <Button
                variant={"outline"}
                className="w-full bg-white border-border"
                onClick={open}
            >
                <FaPlus /> {translation.addNewAddress}
            </Button>
        )}
        <Dialog
            isOpen={isOpen}
            close={close}
            title={isFirstAddress ? translation.addYourAddress: translation.addNewAddress}
        >
            <AddNewAddressForm
                userName={userName}
                userPhone={userPhone}
                isFirstAddress={isFirstAddress}
                close={close}
                setDefaultChecked={true}
                translation={translation}
            />
        </Dialog>
        </>
    )
}

export default CheckoutAddAddressButton