import AddNewAddressButton from "@/components/profile/addresses/AddNewAddressButton"
import AddressCard from "@/components/profile/addresses/AddressCard"
import NoSavedAddresses from "@/components/profile/addresses/NoSavedAddresses"
import Heading from "@/components/ui/Heading"
import { addressesMetadata } from "@/metadata/addresses"
import { getUserAddresses } from "@/server/db/address"
import { getProfile } from "@/server/db/profile"

export const metadata = addressesMetadata

const ProfileAddressesPage = async () => {

    const [addresses, profile] = await Promise.all([getUserAddresses(), getProfile()])

    const userHasNoAddresses = addresses.length === 0
    const userHasMoreThanOneAddress = addresses.length > 1

    return (
        <>
        <Heading
            title="Manage Addresses"
        />
        {addresses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
                {addresses.map(address => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        userHasMoreThanOneAddress={userHasMoreThanOneAddress}
                    />
                ))}
            </div>
        ): (
            <NoSavedAddresses />
        )}
        <AddNewAddressButton
            userName={profile.name}
            userPhone={profile.phone}
            isFirstAddress={userHasNoAddresses}
        />
        </>
    )
}

export default ProfileAddressesPage