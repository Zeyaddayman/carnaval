"use client"

import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { editProfileAction, EditProfileState } from "@/server/actions/profile"
import { Translation } from "@/types/translation"
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast"

interface Props {
    profile: {
        name: string
        email: string
        phone: string
    },
    translation: Translation["profile"]["settings"]["personalInformation"]["form"]
}

const initialState: EditProfileState = {
    message: "",
    errors: {},
    status: undefined,
    formData: undefined
}

const EditProfileForm =  ({ profile, translation }: Props) => {

    const { name, email, phone } = profile

    const formData = new FormData()

    formData.set("name", name)
    formData.set("email", email)
    formData.set("phone", phone)

    initialState.formData = formData

    const [state, action, isPending] = useActionState(editProfileAction, initialState)

    const editProfileFields = [
        {
            label: translation.name.label,
            name: "name",
            type: "text",
            placeholder: translation.name.placeholder
        },
        {
            label: translation.phone.label,
            name: "phone",
            type: "text",
            placeholder: translation.phone.placeholder
        }
    ]

    useEffect(() => {

        if (state.status && state.message) {
            if (state.status === 200) {
                toast.success(state.message)
            } else {
                toast.error(state.message)
            }
        }
    }, [state])

    return (
        <form action={action} className="flex flex-col gap-3">
            <div>
                <label
                    className="text-xs text-muted-foreground mb-2"
                    htmlFor={"email"}
                >
                    {translation.email.label}
                </label>
                <Input
                    type="email"
                    name="email"
                    id="email"
                    disabled={true}
                    value={email}
                />
            </div>
            {editProfileFields.map(field => (
                <div key={field.name}>
                    <label
                        className="text-xs text-muted-foreground mb-2"
                        htmlFor={field.name}
                    >
                        {field.label}
                    </label>
                    <Input
                        type={field.type}
                        name={field.name}
                        id={field.name}
                        placeholder={field.placeholder}
                        defaultValue={(state.formData?.get(field.name) ?? formData.get(field.name)) as string}
                    />
                    <span
                        className="block text-destructive text-xs h-1 mt-1"
                    >
                        {state.errors?.[field.name]}
                    </span>
                </div>
            ))}
            <Button
                variant={"primary"}
                disabled={isPending}
                className="mt-6 w-fit"
            >
                {isPending ? translation.saving : translation.saveChanges}
            </Button>
        </form>
    )
}

export default EditProfileForm