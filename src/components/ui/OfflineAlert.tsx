"use client"

import { useEffect } from "react"
import toast from "react-hot-toast"
import { RiWifiOffLine } from "react-icons/ri"
import { ImConnection } from "react-icons/im";
import { Button } from "./Button"
import { FiX } from "react-icons/fi"
import { Translation } from "@/types/translation";

interface Props {
    translation: Translation["messages"]["connection"]
}

const OfflineAlert = ({ translation }: Props) => {

    useEffect(() => {

        let offlineToastId = ""
        let onlineToastId = ""

        const showOfflineToast = () => {
            offlineToastId = toast.custom(() => (
                <div className="flex items-center gap-3 p-3 py-4 bg-white rounded shadow-md">
                    <RiWifiOffLine size={20} />
                    <p className="text-lg">{translation.connectionLost}</p>
                    <Button
                        variant={"basic"}
                        className="rounded-full"
                        onClick={dismissOfflineToast}
                    >
                        <FiX />
                    </Button>
                </div>
            ), {
                duration: 100000000000,
                removeDelay: 0,
                position: `bottom-left`
            })
        }

        const showOnlineToast = () => {
            onlineToastId = toast.custom(() => (
                <div className="flex items-center gap-3 p-3 py-4 bg-white rounded shadow-md">
                    <ImConnection size={20} color="green" />
                    <p className="text-lg">{translation.connectionRestored}</p>
                    <Button
                        variant={"basic"}
                        className="rounded-full"
                        onClick={dismissOnlineToast}
                    >
                        <FiX />
                    </Button>
                </div>
            ), {
                removeDelay: 0,
                position: `bottom-left`
            })
        }

        const dismissOfflineToast = () => {
            toast.dismiss(offlineToastId)
        }

        const dismissOnlineToast = () => {
            toast.dismiss(onlineToastId)
        }

        const handleOffline = () => {
            dismissOnlineToast()
            showOfflineToast()
        }

        const handleOnline = () => {
            dismissOfflineToast()
            showOnlineToast()
        }

        window.addEventListener("offline", handleOffline)
        window.addEventListener("online", handleOnline)

        return () => {
            dismissOnlineToast()
            dismissOfflineToast()
            window.removeEventListener("offline", handleOffline)
            window.removeEventListener("online", handleOnline)
        }
    }, [])

    return null
}

export default OfflineAlert