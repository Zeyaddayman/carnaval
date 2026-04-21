import { Address } from "@/generated/prisma"
import DeleteAddressButton from "./DeleteAddressButton"
import SetAsDefaultButton from "./SetAsDefaultButton"
import EditAddressButton from "./EditAddressButton"
import { Translation } from "@/types/translation"

interface Props {
    address: Address
    userHasMoreThanOneAddress: boolean
    translation: Translation["profile"]["addresses"]
}

const AddressCard = ({ address, userHasMoreThanOneAddress, translation }: Props) => {
    return (
        <div
            className="px-3 py-6 bg-card border border-border rounded-md"
        >
            <div className="flex justify-between items-center gap-2 flex-wrap mb-5">
                <h5 className="text-lg font-semibold">{address.label}</h5>
                {address.isDefault && <span className="text-xs bg-primary font-medium text-primary-foreground p-2 rounded-full">{translation.addressCard.default}</span>}
            </div>
            <div className="flex flex-col gap-1 text-muted-foreground">
                <p>{translation.addressCard.name}: {address.name}</p>
                <p>{translation.addressCard.phone}: {address.phone}</p>
                <p>{address.country}</p>
                <p>{address.governorate}</p>
                <p>{address.city}</p>
                <p>{address.streetAddress}</p>
            </div>
            <div className="flex justify-between gap-2 flex-wrap mt-5">
                <div className="flex justify-between gap-2 flex-wrap">
                    {!(address.isDefault) && (
                        <SetAsDefaultButton
                            addressId={address.id}
                            translation={translation.addressCard}
                        />
                    )}
                    <EditAddressButton
                        address={address}
                        userHasMoreThanOneAddress={userHasMoreThanOneAddress}
                        translation={translation}
                    />
                </div>
                <DeleteAddressButton
                    addressId={address.id}
                    translation={translation.addressCard}
                />
            </div>
        </div>
    )
}

export default AddressCard