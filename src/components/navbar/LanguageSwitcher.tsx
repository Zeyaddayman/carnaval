'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/constants/i18n';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { HiMiniChevronUpDown } from 'react-icons/hi2';
import { BiCheck } from 'react-icons/bi';
import { Language } from '@/types/i18n';

const LanguageSwitcher = ({ lang }: { lang: Language }) => {

    const router = useRouter()
    const pathname = usePathname()

    const switchLanguage = (newLang: Language) => {
        const newPathname = pathname.replace(`/${lang}`, `/${newLang}`)
        router.push(newPathname)
    }

    return (
        <Listbox value={lang} onChange={switchLanguage}>
            <div className="relative min-w-40 flex-1">
                <ListboxButton className="relative h-9 w-full flex justify-center items-center cursor-default rounded-md bg-input py-3 ps-3 pe-10 text-start border border-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary sm:text-sm/6">
                    <span className="truncate">{lang}</span>
                    <span className="pointer-events-none absolute inset-y-0 end-0 ms-3 flex items-center pe-2">
                        <HiMiniChevronUpDown />
                    </span>
                </ListboxButton>

                <ListboxOptions
                    transition
                    className={`absolute max-h-60 w-full z-30 mt-1 overflow-auto rounded-md bg-input py-1 text-base shadow-lg border-2 border-border focus:outline-none data-closed:data-leave:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in sm:text-sm`}
                >
                    {i18n.languages.map(lang => (
                        <ListboxOption
                            key={lang}
                            value={lang}
                            className="group relative cursor-default overflow-y-hidden select-none py-2 ps-1 pe-4 text-gray-900 data-focus:bg-primary data-focus:text-white"
                        >
                            <span className="ms-2 block truncate font-normal group-data-selected:font-semibold">
                                {lang}
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

export default LanguageSwitcher