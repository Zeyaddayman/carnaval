"use client"

import { Button } from "@/components/ui/Button"
import Dialog from "@/components/ui/Dialog"
import Input from "@/components/ui/Input"
import { Address } from "@/generated/prisma"
import { editAddressAction, EditAddressState } from "@/server/actions/address"
import { useActionState, useEffect, useState } from "react"
import toast from "react-hot-toast"

const editAddressFields = [
    {
        label: "Address Label",
        name: "label",
        type: "text",
        placeholder: "e.g. Home, Work, etc.",
        autoFocus: true
    },
    {
        label: "Full Name",
        name: "name",
        type: "text",
        placeholder: "Enter your full name",
    },
    {
        label: "Phone Number",
        name: "phone",
        type: "text",
        placeholder: "Enter your phone number",
    },
    {
        label: "Country",
        name: "country",
        type: "text",
        placeholder: "Enter your country",
        width: "half"
    },
    {
        label: "Governorate",
        name: "governorate",
        type: "text",
        placeholder: "Enter your governorate",
        width: "half"
    },
    {
        label: "City",
        name: "city",
        type: "text",
        placeholder: "Enter your city",
        width: "half"
    },
    {
        label: "Street Address",
        name: "streetAddress",
        type: "text",
        placeholder: "Enter your street address",
        width: "half"
    }
]

interface Props {
    address: Address,
    userHasMoreThanOneAddress: boolean
}

const initialState: EditAddressState = {
    message: "",
    errors: {},
    status: undefined,
    formData: undefined
}

const EditAddressButton = ({ address, userHasMoreThanOneAddress }: Props) => {

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
                Edit
            </Button>
            <Dialog
                isOpen={isOpen}
                close={close}
                title="Edit Address"
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
                                className="block text-destructive text-xs h-1 mt-1"
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
                                Set as Default Address
                            </label>
                        </div>
                    )}
                    <div className="col-span-2 flex justify-between gap-2 mt-5">
                        <Button
                            variant={"cancel"}
                            type="reset"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={"primary"}
                            type="submit"
                            disabled={isPending}
                            className="min-w-[128px]"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}

export default EditAddressButton