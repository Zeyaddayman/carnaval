"use client"

import { cn } from "@/utils"
import { useState } from "react"
import { FaEye } from "react-icons/fa"
import { FaEyeLowVision } from "react-icons/fa6"

const PasswordInput = ({ ...props }: React.ComponentProps<"input">) => {

    const [type, setType] = useState<"password" | "text">(props.type as "password")

    const toggleType = () => setType(prev => prev === "password" ? "text": "password")

    return (
        <div className="relative">
            <input
                data-slot="input"
                className={cn(
                    "bg-input border border-border flex w-full min-w-0 rounded-md px-3 pr-8 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    "focus-visible:ring-primary focus-visible:ring-3",
                    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
                )}
                {...props}
                type={type}
            />
            <span
                className="absolute p-1 right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={toggleType}
            >
                {type === "password" ? <FaEye /> : <FaEyeLowVision />}
            </span>
        </div>
    )
}

export default PasswordInput