import ProfileSidebar from "@/components/profile/ProfileSidebar"
import { getProfileMetadata } from "@/metadata/profile"
import { isAuthenticated } from "@/server/utils/auth"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"
import { redirect } from "next/navigation"

const ProfileLayout = async ({ params, children }: LayoutProps<"/[lang]/profile">) => {

    const [{ lang }, session] = await Promise.all([params, isAuthenticated()])

    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/profile`)
    }

    const translation = await getTranslation(lang as Language)

    return (
        <main>
            <div className="container">
                <div className="flex gap-5">
                    <ProfileSidebar
                        session={session}
                        lang={lang as Language}
                        translation={translation.profile}
                    />
                    <div className="flex-1 overflow-x-auto">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]/profile">) {

    const { lang } = await params as { lang: Language }

    return await getProfileMetadata(lang)
}

export default ProfileLayout