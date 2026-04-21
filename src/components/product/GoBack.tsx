"use client"

import { useRouter } from "next/navigation"
import { MdKeyboardBackspace } from "react-icons/md"

const GoBack = ({ text }: { text: string }) => {

    const { back } = useRouter()

    const handleGoBack = () => back()

    return (
        <div
            className="px-3 py-1 bg-muted text-muted-foreground flex items-center gap-2 cursor-pointer rounded-md shadow-sm"
            onClick={handleGoBack}
        >
            <MdKeyboardBackspace className="rtl-flip" /> {text}
        </div>
    )
}

export default GoBack