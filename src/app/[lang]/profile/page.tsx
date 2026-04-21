import { buttonVariants } from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import { Address } from "@/generated/prisma"
import { profileMetadata } from "@/metadata/profile"
import { getUserDefaultAddress } from "@/server/db/address"
import { getUserOrdersSummary } from "@/server/db/orders"
import { getProfile } from "@/server/db/profile"
import { Language } from "@/types/i18n"
import { Translation } from "@/types/translation"
import { formatDate } from "@/utils/formatters"
import getTranslation from "@/utils/translation"
import Link from "next/link"

export const metadata = profileMetadata

const ProfileAccountOverviewPage = async ({ params }: PageProps<"/[lang]/profile">) => {

    const [
        profile,
        { totalOrders, pendingOrders, lastOrderDate },
        defaultAddress,
        { lang }

    ] = await Promise.all([
        getProfile(),
        getUserOrdersSummary(),
        getUserDefaultAddress(),
        params
    ])

    const translation = await getTranslation(lang as Language)

    return (
        <>
        <Heading
            title={translation.profile.accountOverview.title}
        />
        <div className="grid md:grid-cols-2 gap-5 break-all">
            <PersonalInformationSection
                profile={profile}
                lang={lang as Language}
                translation={translation.profile.accountOverview.personalInformation}
            />
            <OrdersSummary
                totalOrders={totalOrders}
                pendingOrders={pendingOrders}
                lastOrderDate={lastOrderDate}
                lang={lang as Language}
                translation={translation.profile.accountOverview.ordersSummary}
            />
            <ShippingAddressSection
                defaultAddress={defaultAddress}
                lang={lang as Language}
                translation={translation.profile.accountOverview.shippingAddress}
            />
        </div>
        </>
    )
}

const PersonalInformationSection = ({
    profile,
    lang,
    translation
}: {
    profile: { name: string, email: string, phone: string },
    lang: Language,
    translation: Translation["profile"]["accountOverview"]["personalInformation"]
}) => {
    return (
        <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">{translation.title}</h5>
            <div className="flex flex-col gap-3 text-muted-foreground mb-6">
                <p>{translation.name}: {profile.name}</p>
                <p>{translation.email}: {profile.email}</p>
                <p>{translation.phone}: {profile.phone}</p>
            </div>
            <Link
                href={`/${lang}/profile/settings`}
                className={`${buttonVariants({ variant: "secondary" })} mt-auto`}
            >
                {translation.editProfile}
            </Link>
        </section>
    )
}

const OrdersSummary = ({
    totalOrders,
    pendingOrders,
    lastOrderDate,
    lang,
    translation
}: {
    totalOrders: number,
    pendingOrders: number,
    lastOrderDate: Date,
    lang: Language,
    translation: Translation["profile"]["accountOverview"]["ordersSummary"]
}) => {

    if (totalOrders === 0) return

    return (
        <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">{translation.title}</h5>
                <div className="flex flex-col gap-3 text-muted-foreground mb-6">
                    <p>{translation.totalOrders}: {totalOrders}</p>
                    <p>{translation.lastOrderDate}: {formatDate(lastOrderDate)}</p>
                    <p>{translation.pendingOrders}: {pendingOrders}</p>
                </div>
                <Link
                    href={`/${lang}/profile/orders`}
                    className={`${buttonVariants({ variant: "secondary" })} mt-auto`}
                >
                    {translation.viewOrders}
                </Link>
        </section>
    )
}

const ShippingAddressSection = ({
    defaultAddress,
    lang,
    translation
}: {
    defaultAddress: Address | null,
    lang: Language,
    translation: Translation["profile"]["accountOverview"]["shippingAddress"]
}) => {

    if (!defaultAddress) return

    return (
        <section className="px-3 py-6 flex flex-col bg-card border border-border rounded-md">
            <h5 className="text-xl font-semibold mb-5">{translation.title}</h5>
                <div className="flex flex-col gap-1 text-muted-foreground mb-6">
                    <p>{translation.name}: {defaultAddress.name}</p>
                    <p>{translation.phone}: {defaultAddress.phone}</p>
                    <p>{defaultAddress.country}</p>
                    <p>{defaultAddress.governorate}</p>
                    <p>{defaultAddress.city}</p>
                    <p>{defaultAddress.streetAddress}</p>
                </div>
                <Link
                    href={`/${lang}/profile/addresses`}
                    className={`${buttonVariants({ variant: "secondary" })} mt-auto`}
                >
                    {translation.manageAddresses}
                </Link>
        </section>
    )
}

export default ProfileAccountOverviewPage