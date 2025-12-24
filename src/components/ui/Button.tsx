import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"
import { ComponentProps } from "react"

const buttonVariants = cva(
    `flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap rounded-md cursor-pointer transition-all shrink-0 [&_svg]:shrink-0
    focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gray-500
    disabled:pointer-events-none disabled:opacity-50`,
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-primary/50",
                secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/90",
                cancel: "bg-muted text-muted-foreground shadow-xs hover:bg-muted/90",
                outline: "border border-black shadow-xs",
                destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/50",
                destructiveOutline: "border border-destructive text-destructive shadow-xs hover:bg-destructive hover:text-white focus-visible:ring-destructive/50",
                basic: "bg-input border border-border",
                ghost: "hover:bg-muted",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 px-6 has-[>svg]:px-4",
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        }
    }
)

function Button({
    className,
    variant,
    size,
    ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {props.children}
        </button>
    )
}

export { Button, buttonVariants }
