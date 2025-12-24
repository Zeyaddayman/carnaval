import Heading from "@/components/ui/Heading"
import Link from "next/link"
import RegisterFrom from "@/components/register/Form"
import { registerMetadata } from "@/metadata/auth"

export const metadata = registerMetadata

const RegisterPage = () => {
    return (
        <div>
            <Heading
                title="Register"
                subTitle="Create your Carnaval account to track orders and get exclusive offers."
            />
            <RegisterFrom />
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