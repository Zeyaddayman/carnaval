"use client"

import { Address } from "@/generated/prisma"
import { useEffect, useState, useTransition } from "react"
import { Button } from "../ui/Button"
import { FaCheck } from "react-icons/fa"
import CheckoutAddAddressButton from "./CheckoutAddAddressButton"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { userCartApi } from "@/redux/features/userCartApi"
import { useAppDispatch } from "@/redux/hooks"
import { checkoutAction } from "@/server/actions/checkout"

interface Props {
    addresses: Address[]
    defaultAddress: Address
    formattedTotal: string
    userName: string
    userPhone: string
}

const CheckoutForm = ({ addresses, defaultAddress, formattedTotal, userName, userPhone }: Props) => {

    const [selectedAddress, setSelectedAddress] = useState(defaultAddress)

    const [isPlacingOrder, startPlacingOrder] = useTransition()

    const router = useRouter()
    const dispatch = useAppDispatch()

    useEffect(() => {
        setSelectedAddress(defaultAddress)
    }, [defaultAddress])

    const selectAddress = (label: string) => {
        setSelectedAddress(addresses.find(address => address.label === label)!)
    }

    const placeOrder = () => {
        startPlacingOrder(async () => {
            try {
                const { status, message } = await checkoutAction(selectedAddress.label)

                if (message && status === 201) {
                    toast.success(message)
                    router.push("/profile/orders")
                }
                else {
                    toast.error(message)
                    router.push("/cart")
                }
            }
            catch {
                toast.error("Failed to place the order")
                router.push("/cart")
            }
            finally {
                dispatch(userCartApi.util.invalidateTags(['user-cart']))
            }
        })
    }

    return (
        <div className="my-3">
            <div className="flex flex-wrap gap-2">
                {addresses.map(address => (
                    <AddressRadioBox
                        key={address.id}
                        label={address.label}
                        selectAddress={selectAddress}
                        selectedAddress={selectedAddress}
                    />
                ))}
            </div>
            <div className="my-3">
                <CheckoutAddAddressButton
                    isFirstAddress={false}
                    userName={userName}
                    userPhone={userPhone}
                />
            </div>
            <div className="bg-white border-2 border-border rounded-md p-2">
                <div className="flex flex-col gap-1">
                    <p>Name: {selectedAddress.name}</p>
                    <p>Phone: {selectedAddress.phone}</p>
                    <p>{selectedAddress.country}</p>
                    <p>{selectedAddress.governorate}</p>
                    <p>{selectedAddress.city}</p>
                    <p>{selectedAddress.streetAddress}</p>
                </div>
            </div>
            <Button
                variant={"primary"}
                size={"lg"}
                disabled={!selectedAddress || isPlacingOrder}
                onClick={placeOrder}
                className="!w-full mt-10"
            >
                {isPlacingOrder ? (
                    <>PLACING ORDER...</>
                ): (
                    <><FaCheck /> PLACE ORDER ({formattedTotal})</>
                )}
            </Button>
        </div>
    )
}

const AddressRadioBox = ({
    label,
    selectedAddress,
    selectAddress
}: {
    label: string,
    selectedAddress: Address,
    selectAddress: (label: string) => void
}) => {

    const checked = selectedAddress.label === label

    return (
        <div className="flex-1">
            <input
                type="radio"
                className="peer sr-only"
                id={label}
                checked={checked}
                onChange={() => selectAddress(label)}
            />
            <label
                className={`${checked ? "border-primary" : "border-border"} border-2 bg-white p-2 pr-8 peer-focus-visible:ring-3 peer-focus-visible:ring-primary/50 cursor-pointer w-full rounded-md flex items-center gap-2 transition`}
                htmlFor={label}
            >
                <span className={`${checked ? "bg-primary" : "bg-muted"} w-4 h-4 rounded`}></span> {label}
            </label>
        </div>
    )
}

export default CheckoutForm