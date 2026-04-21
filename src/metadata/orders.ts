import { Language } from "@/types/i18n";
import getTranslation from "@/utils/translation";
import { Metadata } from "next";

export const getOrdersMetadata = async (lang: Language): Promise<Metadata> => {

    const { metadata } = await getTranslation(lang)

    return metadata.profile.orders
}

export const getOrderMetadata = async (lang: Language): Promise<Metadata> => {

    const { metadata } = await getTranslation(lang)

    return metadata.profile.orderDetails
}