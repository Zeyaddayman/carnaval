import { Language } from "@/types/i18n";
import { Translation } from "@/types/translation";
import { inject } from "@/utils/translation";
import Link from "next/link";
import { BsCartCheckFill } from "react-icons/bs";

interface Props {
    quantity: number
    lang: Language
    translation: Translation["product"]
}

export const InYourCart = ({ quantity, lang, translation }: Props) => (
    <div className="flex gap-3 text-sm">
        <div className="p-3 flex gap-2 items-center bg-success text-success-foreground rounded-full">
            <BsCartCheckFill className="rtl-flip" /> {inject(translation.inYourCart, { count: quantity })}
        </div>
        <Link
            href={`/${lang}/cart`}
            className="text-primary p-3 underline"
        >
            {translation.viewCart}
        </Link>
    </div>
)