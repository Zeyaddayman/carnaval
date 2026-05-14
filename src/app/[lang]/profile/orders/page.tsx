import NoOrdersYet from "@/components/profile/orders/NoOrdersYet"
import OrdersFilter from "@/components/profile/orders/OrdersFilter"
import OrdersTable from "@/components/profile/orders/OrdersTable"
import Heading from "@/components/ui/Heading"
import { getOrdersMetadata } from "@/metadata/orders"
import { getUserOrders } from "@/server/db/orders"
import { Language } from "@/generated/prisma"
import { Translation } from "@/types/translation"
import getTranslation from "@/utils/translation"

const ProfileOrdersPage = async ({ params, searchParams }: PageProps<"/[lang]/profile/orders">) => {

    let [{ lang }, { filter }] = await Promise.all([
        params,
        searchParams
    ])

    filter = (filter || "all") as string

    const translation = await getTranslation(lang as Language)

    return (
        <>
        <Heading
            title={translation.profile.orders.title}
        />
        <Orders
            filter={filter}
            lang={lang as Language}
            translation={translation.profile.orders}
        />
        </>
    )
}

const orderStatusOptions = ["pending", "completed", "cancelled"]

const Orders = async ({
    filter,
    lang,
    translation
}: {
    filter: string,
    lang: Language,
    translation: Translation["profile"]["orders"]
}) => {

    const orders = await getUserOrders(filter)

    if ((!orders || orders.length === 0) && !orderStatusOptions.includes(filter)) return <NoOrdersYet lang={lang} translation={translation.noOrdersYet} />

    return (
        <>
        <div className="flex justify-end mb-5">
            <OrdersFilter
                filter={filter}
                translation={translation}
            />
        </div>
        <OrdersTable
            orders={orders}
            lang={lang}
            translation={translation}
        />
        </>
    )
}

export async function generateMetadata({ params }: PageProps<"/[lang]/profile/orders">) {

    const { lang } = await params as { lang: Language }

    return await getOrdersMetadata(lang)
}

export default ProfileOrdersPage