import ProfileSidebar from "@/components/profile/ProfileSidebar"
import { isAuthenticated } from "@/server/utils/auth"
import { Language } from "@/types/i18n"
import getTranslation from "@/utils/translation"
import { redirect } from "next/navigation"

const ProfileLayout = async ({ params, children }: LayoutProps<"/[lang]/profile">) => {

    const [{ lang }, session] = await Promise.all([params, isAuthenticated()])

    if (!session) {
        redirect('/auth/login?redirect=/profile')
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

export default ProfileLayout