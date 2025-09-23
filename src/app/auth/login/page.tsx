
import LoginForm from "@/components/login/Form"
import Heading from "@/components/ui/Heading"
import Link from "next/link"

const LoginPage = () => {
    return (
        <div>
            <Heading
                title="Login"
                subTitle="Welcome back. Login to checkout and track your orders"
            />
            <LoginForm />
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