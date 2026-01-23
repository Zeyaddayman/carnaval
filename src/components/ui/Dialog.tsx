"use client"

import { Dialog as HeadlessDialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react'
import { ReactNode } from 'react'
import { Button } from './Button'
import { FiX } from 'react-icons/fi';

interface Props {
    isOpen: boolean;
    close: () => void;
    title: ReactNode;
    children: ReactNode;
}

export default function Dialog({ isOpen, close, title, children }: Props) {
    return (
        <HeadlessDialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={close}>
            <DialogBackdrop className="fixed inset-0 bg-black/50" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-h-[95vh] overflow-y-auto max-w-md rounded-xl bg-white border-border shadow-xl p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                    >
                        <div className='flex justify-between items-center mb-5'>
                            <DialogTitle as="h3" className="text-xl font-semibold text-foreground">
                                { title }
                            </DialogTitle>
                            <Button variant="ghost" onClick={close} aria-label="Close Dialog">
                                <FiX size={20} />
                            </Button>
                        </div>

                        { children }

                    </DialogPanel>
                </div>
            </div>
        </HeadlessDialog>
    )
}
