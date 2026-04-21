"use client"

import { Address } from "@/generated/prisma"
import { useEffect, useState } from "react"
import CheckoutAddAddressButton from "./CheckoutAddAddressButton"
import { Elements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripeClient"
import PaymentForm from "./PaymentForm"
import { PaymentMethod, PaymentMethodValue } from "@/types/checkout"
import { getPaymentMethods } from "@/constants/checkout"
import { BsCash } from "react-icons/bs"
import { CiCreditCard1 } from "react-icons/ci"
import { Translation } from "@/types/translation"
import { Language } from "@/types/i18n"

interface Props {
    clientSecret: string
    paymentIntentId: string
    addresses: Address[]
    defaultAddress: Address
    formattedTotal: string
    userName: string
    userPhone: string
    lang: Language
    translation: Translation
}

const CheckoutForm = ({ clientSecret, paymentIntentId, addresses, defaultAddress, formattedTotal, userName, userPhone, lang, translation }: Props) => {

    const paymentMethods = getPaymentMethods(translation.checkout.addressAndPayment)

    const [selectedAddress, setSelectedAddress] = useState(defaultAddress)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(paymentMethods[0])

    useEffect(() => {
        setSelectedAddress(defaultAddress)
    }, [defaultAddress])

    const selectAddress = (label: string) => {
        setSelectedAddress(addresses.find(address => address.label === label)!)
    }
    
    const selectPaymentMethod = (paymentMethodValue: PaymentMethodValue) => {
        setSelectedPaymentMethod(paymentMethods.find(method => method.value === paymentMethodValue)!)
    }

    return (
        <div className="my-3">
            <h5 className="font-semibold text-l mb-2">{translation.checkout.addressAndPayment.deliveryAddress}</h5>
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
                    translation={translation.profile.addresses}
                />
            </div>
            <div className="bg-white border-2 border-border rounded-md p-2 mb-5">
                <div className="flex flex-col gap-1">
                    <p>{translation.checkout.addressAndPayment.name}: {selectedAddress.name}</p>
                    <p>{translation.checkout.addressAndPayment.phone}: {selectedAddress.phone}</p>
                    <p>{selectedAddress.country}</p>
                    <p>{selectedAddress.governorate}</p>
                    <p>{selectedAddress.city}</p>
                    <p>{selectedAddress.streetAddress}</p>
                </div>
            </div>
            <h5 className="font-semibold text-l mb-2">{translation.checkout.addressAndPayment.paymentMethod}</h5>
            <div className="flex flex-wrap gap-2 mb-3">
                {paymentMethods.map(paymentMethod => (
                    <PaymentMethodRadioBox
                        key={paymentMethod.value}
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
                    paymentMethodValue={selectedPaymentMethod.value}
                    lang={lang}
                    translation={translation.checkout.addressAndPayment}
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
                className={`${checked ? "border-primary" : "border-border"} border-2 bg-white p-2 pe-8 peer-focus-visible:ring-3 peer-focus-visible:ring-primary/50 cursor-pointer w-full rounded-md flex items-center gap-2 transition`}
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
    selectPaymentMethod: (value: PaymentMethodValue) => void
}) => {

    const checked = selectedPaymentMethod.value === paymentMethod.value

    return (
        <div className="flex-1">
            <input
                type="radio"
                className="peer sr-only"
                id={paymentMethod.value}
                checked={checked}
                onChange={() => selectPaymentMethod(paymentMethod.value)}
            />
            <label
                className={`${checked ? "border-primary" : "border-border"} border-2 bg-white p-2 pe-4 peer-focus-visible:ring-3 peer-focus-visible:ring-primary/50 cursor-pointer w-full rounded-md flex items-center gap-2 transition`}
                htmlFor={paymentMethod.value}
            >
                {paymentMethod.value === "cash" ? <BsCash size={20} /> : paymentMethod.value === "card" ? <CiCreditCard1 size={20} /> : null}

                {paymentMethod.label}

                <div className="flex-1">
                    <div className={`${checked ? "bg-primary" : "bg-muted"} w-4 h-4 rounded-full ms-auto`}></div>
                </div>
            </label>
        </div>
    )
}

export default CheckoutForm