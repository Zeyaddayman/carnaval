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
        >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </Button>
        
        <div 
            className={`fixed lg:static ${isOpen ? "left-0" : "-left-full"} flex gap-3 flex-col 
                lg:flex-row top-0 h-screen lg:h-auto 
                bg-bar text-bar-foreground py-12 px-6 lg:p-0 
                shadow-sm lg:shadow-none z-30 transition-all`}
            >
            <Button
                variant={"ghost"}
                onClick={() => setIsOpen(false)}
                className="self-end mb-10 block lg:hidden"
            >
                <FiX size={20} />
            </Button>
            {links}
        </div>
        </>
    )
}

export default LinksMenu