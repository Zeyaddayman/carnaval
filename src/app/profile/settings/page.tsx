import ChangePasswordFrom from "@/components/profile/settings/ChangePasswordFrom"
import EditProfileForm from "@/components/profile/settings/EditProfileForm"
import Heading from "@/components/ui/Heading"
import { settingsMetadata } from "@/metadata/settings"
import { getProfile } from "@/server/db/profile"

export const metadata = settingsMetadata

const ProfileSettingsPage = () => {
    return (
        <>
        <Heading
            title="Account Settings"
        />
        <div className="grid md:grid-cols-2 gap-5">
            <EditProfileSection />
            <ChangePasswordSection />
        </div>
        </>
    )
}

const EditProfileSection = async () => {

    const profile = await getProfile()

    return (
        <section className="px-3 py-6 bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">Personal Inforamtion</h5>
            <EditProfileForm profile={profile} />
        </section>
    )
}

const ChangePasswordSection = () => {
    return (
        <section className="px-3 py-6 bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">Password & Security</h5>
            <ChangePasswordFrom />
        </section>
    )
}

export default ProfileSettingsPage