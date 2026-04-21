import ChangePasswordFrom from "@/components/profile/settings/ChangePasswordFrom"
import EditProfileForm from "@/components/profile/settings/EditProfileForm"
import Heading from "@/components/ui/Heading"
import { settingsMetadata } from "@/metadata/settings"
import { getProfile } from "@/server/db/profile"
import { Language } from "@/types/i18n"
import { Translation } from "@/types/translation"
import getTranslation from "@/utils/translation"

export const metadata = settingsMetadata

const ProfileSettingsPage = async ({ params }: PageProps<"/[lang]/profile/settings">) => {

    const { lang } = await params

    const translation = await getTranslation(lang as Language)

    return (
        <>
        <Heading
            title={translation.profile.settings.title}
        />
        <div className="grid md:grid-cols-2 gap-5">
            <EditProfileSection
                translation={translation.profile.settings.personalInformation}
            />
            <ChangePasswordSection
                translation={translation.profile.settings.passwordAndSecurity}
            />
        </div>
        </>
    )
}

const EditProfileSection = async ({ translation }: { translation: Translation["profile"]["settings"]["personalInformation"] }) => {

    const profile = await getProfile()

    return (
        <section className="px-3 py-6 bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">{translation.title}</h5>
            <EditProfileForm
                profile={profile}
                translation={translation.form}
            />
        </section>
    )
}

const ChangePasswordSection = ({ translation }: { translation: Translation["profile"]["settings"]["passwordAndSecurity"] }) => {
    return (
        <section className="px-3 py-6 bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">{translation.title}</h5>
            <ChangePasswordFrom
                translation={translation.form}
            />
        </section>
    )
}

export default ProfileSettingsPage