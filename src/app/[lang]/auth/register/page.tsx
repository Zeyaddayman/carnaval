import Heading from "@/components/ui/Heading"
import Link from "next/link"
import RegisterFrom from "@/components/register/Form"
import { getRegisterMetadata } from "@/metadata/auth"
import getTranslation from "@/utils/translation"
import { Language } from "@/types/i18n"
import { i18n } from "@/constants/i18n"

const RegisterPage = async ({ params }: PageProps<"/[lang]/auth/register">) => {

    const { lang } = await params as { lang: Language }

    const translation = await getTranslation(lang)

    return (
        <div>
            <Heading
                title={translation.auth.register.title}
                subTitle={translation.auth.register.subTitle}
            />
            <RegisterFrom lang={lang} translation={translation.auth.register} />
            <p className="text-muted-foreground text-sm text-center mt-6">
                {translation.auth.register.authPrompt.message}
                <Link
                    href={`/${lang}/auth/login`}
                    className="text-primary font-semibold"
                >
                    {translation.auth.register.authPrompt.signUpLinkText}
                </Link>
            </p>
        </div>
    )
}

export async function generateMetadata({ params }: PageProps<"/[lang]/auth/register">) {
    const { lang } = await params as { lang: Language }

    return await getRegisterMetadata(lang)
}

export function generateStaticParams() {
    return i18n.languages.map(lang => ({ lang }))
}

export default RegisterPage