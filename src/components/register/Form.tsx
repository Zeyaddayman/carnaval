"use client"

import { useActionState, useEffect } from "react"
import { Button } from "../ui/Button"
import Input from "../ui/Input"
import { registerAction, RegisterState } from "@/server/actions/auth"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { userSessionApi } from "@/redux/features/userSessionApi"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectLocalCart, setLocalCartItems } from "@/redux/features/localCartSlice"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    lang: Language
    translation: Translation["auth"]["register"]
}

const initialState: RegisterState = {
    message: "",
    errors: {},
    status: undefined,
    formData: undefined
}

const RegisterFrom = ({ lang, translation }: Props) => {

    const localCart = useAppSelector(selectLocalCart)

    const [state, action, isPending] = useActionState(
        registerAction.bind(null, localCart.items.toReversed()),
        initialState
    )

    const registerFields = [
        {
            label: translation.name.label,
            name: "name",
            type: "text",
            placeholder: translation.name.placeholder,
            autoFocus: true
        },
        {
            label: translation.phone.label,
            name: "phone",
            type: "text",
            placeholder: translation.phone.placeholder
        },
        {
            label: translation.email.label,
            name: "email",
            type: "email",
            placeholder: translation.email.placeholder
        },
        {
            label: translation.password.label,
            name: "password",
            type: "password",
            placeholder: translation.password.placeholder
        },
        {
            label: translation.confirmPassword.label,
            name: "confirmPassword",
            type: "password",
            placeholder: translation.confirmPassword.placeholder
        }
    ]

    const dispatch = useAppDispatch()

    const router = useRouter()

    useEffect(() => {
        if (state.status && state.message) {
            if (state.status === 201) {

                toast.success(state.message)

                const searchParams = new URLSearchParams(window.location.search)
                let redirectPath = searchParams.get("redirect") || `/${lang}`

                if (redirectPath.startsWith(`/${lang}/auth`)) redirectPath = `/${lang}`

                dispatch(userSessionApi.util.invalidateTags(['user-session']))

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
                        htmlFor={field.name}
                    >
                        {field.label}
                    </label>
                    <Input
                        type={field.type}
                        id={field.name}
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
                {isPending ? translation.submiting : translation.submit}
            </Button>
        </form>
    )
}

export default RegisterFrom