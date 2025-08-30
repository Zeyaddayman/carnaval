"use client"

import { Dialog as HeadlessDialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { ReactNode } from 'react'
import { Button } from './Button'

interface Props {
    isOpen: boolean;
    close: () => void;
    title: ReactNode;
    children: ReactNode;
}

export default function Dialog({ isOpen, close, title, children }: Props) {
    return (
        <HeadlessDialog open={isOpen} as="div" className="relative z-20 focus:outline-none" onClose={close} __demoMode>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-muted border-border shadow-xl p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-medium text-foreground">
                            { title }
                        </DialogTitle>

                        { children }

                    </DialogPanel>
                </div>
            </div>
        </HeadlessDialog>
    )
}
