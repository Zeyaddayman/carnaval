"use client"

import { FiMenu, FiX } from "react-icons/fi"
import { Button } from "../ui/Button"
import { ReactNode, useState } from "react"

const LinksMenu = ({ links }: { links: ReactNode }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
        <Button
            variant={"ghost"}
            className="block lg:hidden"
            onClick={() => setIsOpen(prev => !prev)}
            aria-label={"Toggle Menu"}
        >
            <FiMenu size={20} />
        </Button>
        
        <div 
            className={`fixed lg:static ${isOpen ? "left-0" : "-left-full"} min-w-60 lg:min-w-auto flex gap-3 flex-col 
                lg:flex-row top-0 h-screen lg:h-auto 
                bg-bar text-bar-foreground py-12 px-6 lg:p-0 
                shadow-sm lg:shadow-none z-40 transition-all ease-in-out`}
            >
            <Button
                variant={"ghost"}
                onClick={() => setIsOpen(false)}
                className="self-end mb-10 block lg:hidden"
                aria-label={"Close Menu"}
            >
                <FiX size={20} />
            </Button>
            {links}
        </div>
        </>
    )
}

export default LinksMenu