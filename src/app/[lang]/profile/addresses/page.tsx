import AddNewAddressButton from "@/components/profile/addresses/AddNewAddressButton"
import AddressCard from "@/components/profile/addresses/AddressCard"
import NoSavedAddresses from "@/components/profile/addresses/NoSavedAddresses"
import Heading from "@/components/ui/Heading"
import { getAddressesMetadata } from "@/metadata/addresses"
import { getUserAddresses } from "@/server/db/address"
import { getProfile } from "@/server/db/profile"
import { Language } from "@/generated/prisma"
import getTranslation from "@/utils/translation"

const ProfileAddressesPage = async ({ params }: PageProps<"/[lang]/profile/addresses">) => {

    const [addresses, profile, { lang }] = await Promise.all([getUserAddresses(), getProfile(), params])

    const userHasNoAddresses = addresses.length === 0
    const userHasMoreThanOneAddress = addresses.length > 1

    const translation = await getTranslation(lang as Language)

    return (
        <>
        <Heading
            title={translation.profile.addresses.title}
        />
        {addresses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
                {addresses.map(address => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        userHasMoreThanOneAddress={userHasMoreThanOneAddress}
                        translation={translation.profile.addresses}
                    />
                ))}
            </div>
        ): (
            <NoSavedAddresses
                translation={translation.profile.addresses.noSavedAddresses}
            />
        )}
        <AddNewAddressButton
            userName={profile.name}
            userPhone={profile.phone}
            isFirstAddress={userHasNoAddresses}
            translation={translation.profile.addresses}
        />
        </>
    )
}

export async function generateMetadata({ params }: PageProps<"/[lang]/profile/addresses">) {

    const { lang } = await params as { lang: Language }

    return await getAddressesMetadata(lang)
}

export default ProfileAddressesPage