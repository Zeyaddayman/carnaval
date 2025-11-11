"use client"

import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { MouseEventHandler, useRef, useState } from 'react'
import { BiCheck } from 'react-icons/bi'
import { HiMiniChevronUpDown } from 'react-icons/hi2'

type Option = {
    label: string
    value: string
}

interface Props {
    title: string
    selected: Option
    setSelected: (option: Option) => void
    options: Option[]
}

const SelectMenu = ({ title, options, selected, setSelected }: Props) => {

    const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom')
    const selectRef = useRef<HTMLDivElement>(null)

    const handlePlacement: MouseEventHandler<HTMLDivElement> = (e) => {
        const el = selectRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        const spaceBelow = viewportHeight - rect.bottom
        const spaceAbove = rect.top
        const optionsMaxHeight = 240

        setPlacement(( spaceBelow > optionsMaxHeight) ? 'bottom' : 'top')
    }

    return (
        <Listbox  value={selected} onChange={setSelected}>
            <div onClick={handlePlacement} ref={selectRef} className="relative min-w-70">
                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm/6">
                    <span className="ml-3 block truncate">{title} {selected.label}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <HiMiniChevronUpDown />
                    </span>
                </ListboxButton>

                <ListboxOptions
                    transition
                    className={`absolute max-h-60 w-full z-30 ${placement === "top" ? "bottom-full mb-1" : "mt-1"} overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm`}
                >
                    {options.map((option) => (
                        <ListboxOption
                            key={option.value}
                            value={option}
                            className="group relative cursor-default overflow-y-hidden select-none py-3 pl-3 pr-9 text-gray-900 data-[focus]:bg-primary data-[focus]:text-white"
                        >
                            <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                                {option.label}
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

export default SelectMenu