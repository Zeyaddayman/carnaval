import { Language } from "@/types/i18n";
import getTranslation from "@/utils/translation";
import { Metadata } from "next";

export const getSettingsMetadata = async (lang: Language): Promise<Metadata> => {

    const { metadata } = await getTranslation(lang)

    return metadata.profile.settings
}