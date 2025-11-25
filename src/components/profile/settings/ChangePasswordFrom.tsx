"use client"

import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { changePasswordAction, ChangePasswordState, EditProfileState } from "@/server/actions/profile"
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast"


const changePasswordFields = [
    {
        label: "Current Password",
        name: "currentPassword",
        type: "password",
        placeholder: "Enter your current password"
    },
    {
        label: "New Password",
        name: "newPassword",
        type: "password",
        placeholder: "Enter your new password"
    },
    {
        label: "Confirm New Password",
        name: "confirmNewPassword",
        type: "password",
        placeholder: "Re-enter your new password"
    }
]

const initialState: ChangePasswordState = {
    message: "",
    errors: {},
    status: undefined,
    formData: undefined
}

const ChangePasswordFrom =  () => {

    const [state, action, isPending] = useActionState(changePasswordAction, initialState)

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
            {changePasswordFields.map(field => (
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
                        defaultValue={state.formData?.get(field.name) as string}
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
                Update Password
            </Button>
        </form>
    )
}

export default ChangePasswordFrom