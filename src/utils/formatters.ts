import { $ZodIssue } from "zod/v4/core"

export function formatPrice(price: number): string {

    const PRICE_FORMATTER = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })

    return PRICE_FORMATTER.format(price)
}

export function formatRating(rating: number): number {

    const RATING_FORMATTER = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 1,
        roundingMode: "floor"
    })

    return Number(RATING_FORMATTER.format(rating))
}

export function formatDate(date: Date) {
    const DATE_FORMATTER = new Intl.DateTimeFormat("en-US")

    return DATE_FORMATTER.format(date)
}

export function formatErrors(issues: $ZodIssue[]) {

    return issues.reduce<{ [error: string]: string }>((acc, current) => {
        const error = String(current.path)

        if (!acc[error]) acc[error] = current.message

        return acc
    }, {})
}