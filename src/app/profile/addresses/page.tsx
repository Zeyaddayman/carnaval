import AddNewAddress from "@/components/profile/addresses/AddNewAddress"
import AddressCard from "@/components/profile/addresses/AddressCard"
import NoSavedAddresses from "@/components/profile/addresses/NoSavedAddresses"
import Heading from "@/components/ui/Heading"
import { getProfile, getUserAddresses } from "@/server/db/profile"

const ProfileAddressesPage = async () => {

    const addresses = await getUserAddresses()

    const profile = await getProfile()

    return (
        <>
        <Heading
            title="Manage Addresses"
        />
        {addresses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
                {addresses.map(address => (
                    <AddressCard key={address.id} address={address} />
                ))}
            </div>
        ): (
            <NoSavedAddresses />
        )}
        <AddNewAddress userName={profile.name} userPhone={profile.phone} />
        </>
    )
}

export default ProfileAddressesPage