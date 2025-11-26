import { buttonVariants } from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import { getProfile, getUserDefaultAddress } from "@/server/db/profile"
import Link from "next/link"

const ProfileAccountOverviewPage = () => {
    return (
        <>
        <Heading
            title="Account Overview"
        />
        <div className="grid md:grid-cols-2 gap-5">
            <PersonalInformationSection />
            <ShippingAddressSection />
        </div>
        </>
    )
}

const PersonalInformationSection = async () => {

    const profile = await getProfile()

    return (
        <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">Personal Inforamtion</h5>
            <div className="flex flex-col gap-3 text-muted-foreground mb-6">
                <p>Name: {profile.name}</p>
                <p>Email: {profile.email}</p>
                <p>Phone: {profile.phone}</p>
            </div>
            <Link
                href={"/profile/settings"}
                className={`${buttonVariants({ variant: "secondary" })} mt-auto`}
            >
                Edit Profile
            </Link>
        </section>
    )
}

const ShippingAddressSection = async () => {

    const defaultAddress = await getUserDefaultAddress()

    if (!defaultAddress) return

    return (
        <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">Shipping Address</h5>
                <div className="flex flex-col gap-1 text-muted-foreground mb-6">
                    <p>Name: {defaultAddress.name}</p>
                    <p>Phone: {defaultAddress.phone}</p>
                    <p>{defaultAddress.country}</p>
                    <p>{defaultAddress.governorate}</p>
                    <p>{defaultAddress.city}</p>
                    <p>{defaultAddress.streetAddress}</p>
                </div>
                <Link
                    href={"/profile/addresses"}
                    className={`${buttonVariants({ variant: "secondary" })} mt-auto`}
                >
                    Manage Addresses
                </Link>
        </section>
    )
}

export default ProfileAccountOverviewPage