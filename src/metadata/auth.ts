import { Language } from "@/types/i18n";
import getTranslation from "@/utils/translation";
import { Metadata } from "next";

export const getLoginMetadata = async (lang: Language): Promise<Metadata> => {

    const { metadata } = await getTranslation(lang)

    return metadata.auth.login
}

export const getRegisterMetadata = async (lang: Language): Promise<Metadata> => {

    const { metadata } = await getTranslation(lang)

    return metadata.auth.register
}