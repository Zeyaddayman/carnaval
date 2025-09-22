import { cn } from "@/lib/utils"

function Input({ className, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            data-slot="input"
            className={cn(
                "bg-input border border-border flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:ring-primary focus-visible:ring-2",
                "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export default Input
