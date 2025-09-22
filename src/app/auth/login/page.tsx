import { Button } from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import Input from "@/components/ui/Input"
import Link from "next/link"

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

const LoginPage = () => {
    return (
        <div>
            <Heading
                title="Login"
                subTitle="Welcome back. Login to checkout and track your orders"
            />
            <form
                action=""
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
                    Login
                </Button>
            </form>
            <p className="text-muted-foreground text-sm text-center mt-6">
                New to Carnaval? {" "}
                <Link
                    href={"/auth/register"}
                    className="text-primary font-semibold"
                >
                    Register
                </Link>
            </p>
        </div>
    )
}

export default LoginPage