"use client"

import { Button } from "@/components/ui/Button"
import Dialog from "@/components/ui/Dialog"
import Input from "@/components/ui/Input"
import { Address } from "@/generated/prisma"
import { editAddressAction, EditAddressState } from "@/server/actions/address"
import { Translation } from "@/types/translation"
import { useActionState, useEffect, useState } from "react"
import toast from "react-hot-toast"

interface Props {
    address: Address
    userHasMoreThanOneAddress: boolean
    translation: Translation["profile"]["addresses"]
}

const initialState: EditAddressState = {
    message: "",
    errors: {},
    status: undefined,
    formData: undefined
}

const EditAddressButton = ({ address, userHasMoreThanOneAddress, translation }: Props) => {

    const [isOpen, setIsOpen] = useState(false)

    const close = () => setIsOpen(false)
    const open = () => setIsOpen(true)

    const [state, action, isPending] = useActionState(
        editAddressAction.bind(null, address.id),
        initialState
    )

    const formData = new FormData()

    for (const key in address) {
        if (typeof address[key as keyof Address] === "string") {
            formData.set(key, address[key as keyof Address] as string)
        }
    }

    const editAddressFields = [
        {
            label: translation.addressForm.addressLabel.label,
            name: "label",
            type: "text",
            placeholder: translation.addressForm.addressLabel.placeholder,
            autoFocus: true
        },
        {
            label: translation.addressForm.name.label,
            name: "name",
            type: "text",
            placeholder: translation.addressForm.name.placeholder,
        },
        {
            label: translation.addressForm.phone.label,
            name: "phone",
            type: "text",
            placeholder: translation.addressForm.phone.placeholder,
        },
        {
            label: translation.addressForm.country.label,
            name: "country",
            type: "text",
            placeholder: translation.addressForm.country.placeholder,
            width: "half"
        },
        {
            label: translation.addressForm.governorate.label,
            name: "governorate",
            type: "text",
            placeholder: translation.addressForm.governorate.placeholder,
            width: "half"
        },
        {
            label: translation.addressForm.city.label,
            name: "city",
            type: "text",
            placeholder: translation.addressForm.city.placeholder,
            width: "half"
        },
        {
            label: translation.addressForm.streetAddress.label,
            name: "streetAddress",
            type: "text",
            placeholder: translation.addressForm.streetAddress.placeholder,
            width: "half"
        }
    ]

    useEffect(() => {

        if (state.status && state.message) {
            if (state.status === 200) {
                toast.success(state.message)
                close()
            } else {
                toast.error(state.message)
            }
        }
    }, [state])

    return (
        <div>
            <Button
                variant={"secondary"}
                onClick={open}
            >
                {translation.addressCard.edit}
            </Button>
            <Dialog
                isOpen={isOpen}
                close={close}
                title={translation.editAddress}
            >
                <form
                    action={action}
                    className="grid grid-cols-2 gap-2"
                >
                    {editAddressFields.map(field => (
                        <div key={field.name} className={field.width === "half" ? "col-span-1" : "col-span-2"}>
                            <label
                                className="text-xs text-muted-foreground mb-2"
                                htmlFor={field.name}
                            >
                                {field.label}
                            </label>
                            <Input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                defaultValue={(state.formData?.get(field.name) ?? formData.get(field.name)) as string}
                                autoFocus={field.autoFocus}
                            />
                            <span
                                className="text-destructive text-xs mt-1"
                            >
                                {state.errors?.[field.name]}
                            </span>
                        </div>
                    ))}
                    {userHasMoreThanOneAddress && (
                        <div className="col-span-2 flex items-center gap-2 mt-2">
                            <input
                                type={"checkbox"}
                                id={"default"}
                                name={"default"}
                                defaultChecked={address.isDefault}
                                className="scale-125"
                            />
                            <label
                                className="text-sm select-none"
                                htmlFor="default"
                            >
                                {translation.addressForm.setAsDefaultAddress}
                            </label>
                        </div>
                    )}
                    <div className="col-span-2 flex justify-between gap-2 mt-5">
                        <Button
                            variant={"cancel"}
                            type="reset"
                            onClick={close}
                        >
                            {translation.addressForm.cancel}
                        </Button>
                        <Button
                            variant={"primary"}
                            type="submit"
                            disabled={isPending}
                            className="min-w-32"
                        >
                            {isPending ? translation.addressForm.saving : translation.addressForm.saveChanges}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}

export default EditAddressButton