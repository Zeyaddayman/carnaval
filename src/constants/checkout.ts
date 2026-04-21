import { Translation } from "@/types/translation"

export const getPaymentMethods = (translation: Translation["checkout"]["addressAndPayment"]) => {
    return [
        { label: translation.cash, value: "cash" },
        { label: translation.card, value: "card" }
    ] as const
}