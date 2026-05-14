import LoginForm from "@/components/login/Form"
import Heading from "@/components/ui/Heading"
import { i18n } from "@/constants/i18n"
import { getLoginMetadata } from "@/metadata/auth"
import { Language } from "@/generated/prisma"
import getTranslation from "@/utils/translation"
import Link from "next/link"

const LoginPage = async ({ params }: PageProps<"/[lang]/auth/login">) => {

    const { lang } = await params as { lang: Language }

    const translation = await getTranslation(lang)

    return (
        <div>
            <Heading
                title={translation.auth.login.title}
                subTitle={translation.auth.login.subTitle}
            />
            <LoginForm lang={lang} translation={translation.auth.login} />
            <p className="text-muted-foreground text-sm text-center mt-6">
                {translation.auth.login.authPrompt.message}
                <Link
                    href={`/${lang}/auth/register`}
                    className="text-primary font-semibold"
                >
                    {translation.auth.login.authPrompt.signUpLinkText}
                </Link>
            </p>
        </div>
    )
}

export async function generateMetadata({ params }: PageProps<"/[lang]/auth/login">) {
    const { lang } = await params as { lang: Language }

    return await getLoginMetadata(lang)
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}

export default LoginPage