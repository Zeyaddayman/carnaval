"use client"

import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { editProfileAction, EditProfileState } from "@/server/actions/profile"
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast"

const editProfileFields = [
    {
        label: "Full name",
        name: "name",
        type: "text",
        placeholder: "Enter your full name"
    },
    {
        label: "Phone number",
        name: "phone",
        type: "text",
        placeholder: "Enter your phone number"
    }
]

interface Props {
    profile: {
        name: string
        email: string
        phone: string
    }
}

const initialState: EditProfileState = {
    message: "",
    errors: {},
    status: undefined,
    formData: undefined
}

const EditProfileForm =  ({ profile }: Props) => {

    const { name, email, phone } = profile

    const formData = new FormData()

    formData.set("name", name)
    formData.set("email", email)
    formData.set("phone", phone)

    initialState.formData = formData

    const [state, action, isPending] = useActionState(editProfileAction, initialState)

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
                    Email
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
                Save Changes
            </Button>
        </form>
    )
}

export default EditProfileForm