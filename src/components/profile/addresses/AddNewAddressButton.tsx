"use client"

import { Button } from "@/components/ui/Button"
import Dialog from "@/components/ui/Dialog"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import AddNewAddressForm from "./AddNewAddressForm"
import { Translation } from "@/types/translation"

interface Props {
    userName: string
    userPhone: string
    isFirstAddress: boolean
    translation: Translation["profile"]["addresses"]
}

const AddNewAddressButton = ({ userName, userPhone, isFirstAddress, translation }: Props) => {

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
                <FaPlus /> {isFirstAddress ? translation.addYourAddressCaps : translation.addNewAddress}
            </Button>
            <Dialog
                isOpen={isOpen}
                close={close}
                title={isFirstAddress ? translation.addYourAddress : translation.addNewAddress}
            >
                <AddNewAddressForm
                    userName={userName}
                    userPhone={userPhone}
                    isFirstAddress={isFirstAddress}
                    close={close}
                    translation={translation}
                />
            </Dialog>
        </div>
    )
}

export default AddNewAddressButton