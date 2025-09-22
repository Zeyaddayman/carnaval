import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Heading from "@/components/ui/Heading"
import Link from "next/link"

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
        placeholder: "Enter your email",
    },
    {
        label: "Password",
        name: "password",
        type: "password",
        placeholder: "Enter your password",
    },
    {
        label: "Confirm password",
        name: "confirmPassword",
        type: "password",
        placeholder: "Re-enter your password",
    }
]

const RegisterPage = () => {
    return (
        <div>
            <Heading
                title="Register"
                subTitle="Create your Carnaval account to track orders and get exclusive offers."
            />
            <form
                action=""
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
                            autoFocus={field.autoFocus}
                        />
                    </div>
                ))}
                <Button
                    variant={"default"}
                    size={"lg"}
                    type="submit"
                    className="w-full mt-5"
                >
                    Register
                </Button>
            </form>
            <p className="text-muted-foreground text-sm text-center mt-6">
                Already have an account? {" "}
                <Link
                    href={"/auth/login"}
                    className="text-primary font-semibold"
                >
                    Login
                </Link>
            </p>
        </div>
    )
}

export default RegisterPage