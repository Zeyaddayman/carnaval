import { Language } from "@/generated/prisma";
import getTranslation from "@/utils/translation";
import { Metadata } from "next";

export const getAddressesMetadata = async (lang: Language): Promise<Metadata> => {

    const { metadata } = await getTranslation(lang)

    return metadata.profile.addresses
}