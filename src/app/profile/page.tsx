import { buttonVariants } from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import { getUserDefaultAddress } from "@/server/db/address"
import { getUserOrdersSummary } from "@/server/db/orders"
import { getProfile } from "@/server/db/profile"
import Link from "next/link"

const ProfileAccountOverviewPage = () => {
    return (
        <>
        <Heading
            title="Account Overview"
        />
        <div className="grid md:grid-cols-2 gap-5">
            <PersonalInformationSection />
            <OrdersSummary />
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

const OrdersSummary = async () => {

    const { totalOrders, pendingOrders, lastOrderDate } = await getUserOrdersSummary()

    if (totalOrders === 0) return

    return (
        <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">Orders Summary</h5>
                <div className="flex flex-col gap-3 text-muted-foreground mb-6">
                    <p>Total Orders: {totalOrders}</p>
                    <p>Last Order Date: {new Date(lastOrderDate).toLocaleDateString()}</p>
                    <p>Pending Orders: {pendingOrders}</p>
                </div>
                <Link
                    href={"/profile/orders"}
                    className={`${buttonVariants({ variant: "secondary" })} mt-auto`}
                >
                    View Orders
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