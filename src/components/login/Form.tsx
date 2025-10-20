"use client"

import toast, { LoaderIcon } from "react-hot-toast"
import { Button } from "../ui/Button"
import Input from "../ui/Input"
import { useActionState, useEffect } from "react"
import { login, LoginState } from "@/server/actions/auth"
import { useRouter } from "next/navigation"
import { useGetUserSessionQuery } from "@/redux/features/userSessionApi"

const loginFields = [
    {
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "Enter your email",
        autoFocus: true
    },
    {
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Enter your password"
    }
]

const initialState: LoginState = {
    message: "",
    errors: {},
    status: undefined,
    formData: undefined
}

const LoginForm = () => {

    const [state, loginAction, isPending] = useActionState(login, initialState)
    const router = useRouter()
    const { refetch } = useGetUserSessionQuery({})

    useEffect(() => {
        if (state.status && state.message) {
            if (state.status === 200) {

                toast.success(state.message)

                // didn't use the useSearchParams hook to prevent wrap this component in Suspense
                const searchParams = new URLSearchParams(window.location.search)
                const redirectPath = searchParams.get("redirect") || "/"

                refetch()

                router.push(redirectPath)

            } else {
                toast.error(state.message)
            }
        }
    }, [state])

    return (
        <form
            action={loginAction}
            className="space-y-2"
            >
            {loginFields.map(field => (
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
                {isPending ? (<><LoaderIcon /> logging...</>) : "Login"}
            </Button>
        </form>
    )
}

export default LoginForm