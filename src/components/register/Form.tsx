"use client"

import { useActionState, useEffect } from "react"
import { Button } from "../ui/Button"
import Input from "../ui/Input"
import { registerAction, RegisterState } from "@/server/actions/auth"
import toast, { LoaderIcon } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useGetUserSessionQuery } from "@/redux/features/userSessionApi"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectLocalCart, setLocalCartItems } from "@/redux/features/localCartSlice"

const registerFields = [
    {
        label: "Full name",
        name: "name",
        type: "text",
        placeholder: "Enter your full name",
        autoFocus: true
    },
    {
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "Enter your email"
    },
    {
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Enter your password"
    },
    {
        label: "Confirm password",
        name: "confirmPassword",
        type: "password",
        placeholder: "Re-enter your password"
    }
]

const initialState: RegisterState = {
    message: "",
    errors: {},
    status: undefined,
    formData: undefined
}

const RegisterFrom = () => {

    const localCart = useAppSelector(selectLocalCart)

    const [state, action, isPending] = useActionState(
        registerAction.bind(null, localCart.items.toReversed()),
        initialState
    )

    const dispatch = useAppDispatch()

    const router = useRouter()
    const { refetch } = useGetUserSessionQuery({})

    useEffect(() => {
        if (state.status && state.message) {
            if (state.status === 201) {

                toast.success(state.message)

                const searchParams = new URLSearchParams(window.location.search)
                const redirectPath = searchParams.get("redirect") || "/"

                refetch()

                dispatch(setLocalCartItems([]))

                router.push(redirectPath)

            } else {
                toast.error(state.message)
            }
        }
    }, [state])

    return (
        <form
            action={action}
            className="space-y-2"
            >
            {registerFields.map(field => (
                <div key={field.name}>
                    <label
                        className="text-xs text-muted-foreground mb-2"
                    >
                        {field.label}
                    </label>
                    <Input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        defaultValue={state.formData?.get(field.name) as string}
                        autoFocus={field.autoFocus}
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
                size={"lg"}
                type="submit"
                className="w-full mt-5"
                disabled={isPending}
            >
                {isPending ? (<><LoaderIcon /> Registering...</>) : "Register"}
            </Button>
        </form>
    )
}

export default RegisterFrom