'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LanguagesMenu } from '@/constants/i18n';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { HiMiniChevronUpDown } from 'react-icons/hi2';
import { BiCheck } from 'react-icons/bi';
import { Language } from "@/generated/prisma";

const SelectLanguage = ({ lang }: { lang: Language }) => {

    const router = useRouter()
    const pathname = usePathname()

    const selectedLanguage = LanguagesMenu.find(langOption => langOption.value === lang)!

    const switchLanguage = (newLang: { label: string, value: Language }) => {
        const newPathname = pathname.replace(`/${lang}`, `/${newLang.value}`)
        router.push(newPathname)
    }

    return (
        <Listbox value={selectedLanguage} onChange={switchLanguage}>
            <div className="relative min-w-35 flex-1">
                <ListboxButton className="relative h-9 w-full flex justify-center items-center cursor-default rounded-md bg-input py-3 ps-3 pe-10 text-start border border-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary sm:text-sm/6">
                    <span className="truncate">{selectedLanguage.label}</span>
                    <span className="pointer-events-none absolute inset-y-0 end-0 ms-3 flex items-center pe-2">
                        <HiMiniChevronUpDown />
                    </span>
                </ListboxButton>

                <ListboxOptions
                    transition
                    className={`absolute max-h-60 w-full z-40 mt-1 overflow-auto rounded-md bg-input py-1 text-base shadow-lg border-2 border-border focus:outline-none data-closed:data-leave:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in sm:text-sm`}
                >
                    {LanguagesMenu.map(langOption => (
                        <ListboxOption
                            key={langOption.value}
                            value={langOption}
                            className="group relative cursor-default overflow-y-hidden select-none py-2 ps-1 pe-4 text-gray-900 data-focus:bg-primary data-focus:text-white"
                        >
                            <span className="ms-2 block truncate font-normal group-data-selected:font-semibold">
                                {langOption.label}
                            </span>

                            <span className="absolute inset-y-0 end-0 flex items-center pe-1 text-primary group-data-focus:text-white [.group:not([data-selected])_&]:hidden">
                                <BiCheck aria-hidden="true" className="size-5" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    )
}

export default SelectLanguage