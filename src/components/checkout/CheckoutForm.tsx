"use client"

import { Address } from "@/generated/prisma"
import { useEffect, useState } from "react"
import CheckoutAddAddressButton from "./CheckoutAddAddressButton"
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripeClient"
import PaymentForm from "./PaymentForm"
import { PaymentMethod } from "@/types/checkout"
import { PAYMENT_METHODS } from "@/constants/checkout"
import { BsCash } from "react-icons/bs"
import { CiCreditCard1 } from "react-icons/ci"

interface Props {
    clientSecret: string
    paymentIntentId: string
    addresses: Address[]
    defaultAddress: Address
    formattedTotal: string
    userName: string
    userPhone: string
}

const CheckoutForm = ({ clientSecret, paymentIntentId, addresses, defaultAddress, formattedTotal, userName, userPhone }: Props) => {

    const [selectedAddress, setSelectedAddress] = useState(defaultAddress)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash')

    useEffect(() => {
        setSelectedAddress(defaultAddress)
    }, [defaultAddress])

    const selectAddress = (label: string) => {
        setSelectedAddress(addresses.find(address => address.label === label)!)
    }
    
    const selectPaymentMethod = (paymentMethod: PaymentMethod) => {
        setSelectedPaymentMethod(paymentMethod)
    }

    return (
        <div className="my-3">
            <h5 className="font-semibold text-l mb-2">Delivery Address</h5>
            <div className="flex flex-wrap gap-2">
                {addresses.map(address => (
                    <AddressRadioBox
                        key={address.id}
                        label={address.label}
                        selectedAddress={selectedAddress}
                        selectAddress={selectAddress}
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
            <div className="bg-white border-2 border-border rounded-md p-2 mb-5">
                <div className="flex flex-col gap-1">
                    <p>Name: {selectedAddress.name}</p>
                    <p>Phone: {selectedAddress.phone}</p>
                    <p>{selectedAddress.country}</p>
                    <p>{selectedAddress.governorate}</p>
                    <p>{selectedAddress.city}</p>
                    <p>{selectedAddress.streetAddress}</p>
                </div>
            </div>
            <h5 className="font-semibold text-l mb-2">Payment Method</h5>
            <div className="flex flex-wrap gap-2 mb-3">
                {PAYMENT_METHODS.map(paymentMethod => (
                    <PaymentMethodRadioBox
                        key={paymentMethod}
                        paymentMethod={paymentMethod}
                        selectedPaymentMethod={selectedPaymentMethod}
                        selectPaymentMethod={selectPaymentMethod}
                    />
                ))}
            </div>
            <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: {
                    variables: { colorPrimary: "#00b09f" },
                    rules: {
                        '.Input:focus': {
                            boxShadow: '0 0 0 3px #00b09f80',
                        }
                    }
                }}}
            >
                <PaymentForm
                    clientSecret={clientSecret}
                    paymentIntentId={paymentIntentId}
                    selectedAddress={selectedAddress}
                    formattedTotal={formattedTotal}
                    paymentMethod={selectedPaymentMethod}
                />
            </Elements>
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

const PaymentMethodRadioBox = ({
    paymentMethod,
    selectedPaymentMethod,
    selectPaymentMethod
}: {
    paymentMethod: PaymentMethod,
    selectedPaymentMethod: PaymentMethod,
    selectPaymentMethod: (label: PaymentMethod) => void
}) => {

    const checked = selectedPaymentMethod === paymentMethod

    return (
        <div className="flex-1">
            <input
                type="radio"
                className="peer sr-only"
                id={paymentMethod}
                checked={checked}
                onChange={() => selectPaymentMethod(paymentMethod)}
            />
            <label
                className={`${checked ? "border-primary" : "border-border"} capitalize border-2 bg-white p-2 pr-4 peer-focus-visible:ring-3 peer-focus-visible:ring-primary/50 cursor-pointer w-full rounded-md flex items-center gap-2 transition`}
                htmlFor={paymentMethod}
            >
                {paymentMethod === "cash" ? <BsCash size={20} /> : paymentMethod === "card" ? <CiCreditCard1 size={20} /> : null}

                {paymentMethod}

                <div className="flex-1">
                    <div className={`${checked ? "bg-primary" : "bg-muted"} w-4 h-4 rounded-full ml-auto`}></div>
                </div>
            </label>
        </div>
    )
}

export default CheckoutForm