import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { MouseEventHandler, useRef, useState } from "react"
import { BiCheck } from "react-icons/bi"
import { HiMiniChevronUpDown } from "react-icons/hi2"

interface Props {
    limit: number
    quantity: number
    setQuantity: (qty: number) => void
}

const QuantitySelector = ({ limit, quantity, setQuantity }: Props) => {

    const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom')
    const selectorRef = useRef<HTMLDivElement>(null)

    const handlePlacement: MouseEventHandler<HTMLDivElement> = (e) => {
        const el = selectorRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const spaceBelow = viewportHeight - rect.bottom
        const optionsMaxHeight = 240

        setPlacement(( spaceBelow > optionsMaxHeight) ? 'bottom' : 'top')
    }

    return (
        <Listbox value={quantity} onChange={setQuantity}>
            <div onClick={handlePlacement} ref={selectorRef} className="relative min-w-30 flex-1">
                <ListboxButton className="relative h-9 w-full flex justify-center items-center cursor-default rounded-md bg-input py-3 pl-3 pr-10 text-left border border-border focus:outline-none focus:ring-3 focus:ring-primary/50 sm:text-sm/6">
                    <span className="truncate">{quantity}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <HiMiniChevronUpDown />
                    </span>
                </ListboxButton>

                <ListboxOptions
                    transition
                    className={`absolute max-h-60 w-full z-30 ${placement === "top" ? "bottom-full mb-1" : "mt-1"} overflow-auto rounded-md bg-input py-1 text-base shadow-lg border-2 border-border focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm`}
                >
                    {Array.from({ length: limit }, (_, i) => i + 1).map((qty) => (
                        <ListboxOption
                            key={qty}
                            value={qty}
                            className="group relative cursor-default overflow-y-hidden select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-primary data-[focus]:text-white"
                        >
                            <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                                {qty}
                            </span>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                <BiCheck aria-hidden="true" className="size-5" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    )
}

export default QuantitySelector