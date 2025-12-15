import { Address } from "@/generated/prisma"
import DeleteAddressButton from "./DeleteAddressButton"
import SetAsDefaultButton from "./SetAsDefaultButton"
import EditAddressButton from "./EditAddressButton"

interface Props {
    address: Address
    userHasMoreThanOneAddress: boolean
}

const AddressCard = ({ address, userHasMoreThanOneAddress }: Props) => {
    return (
        <div
            className="px-3 py-6 bg-card border border-border rounded-md"
        >
            <div className="flex justify-between items-center gap-2 flex-wrap mb-5">
                <h5 className="text-lg font-semibold">{address.label}</h5>
                {address.isDefault && <span className="text-xs bg-primary font-medium text-primary-foreground p-2 rounded-full">Default</span>}
            </div>
            <div className="flex flex-col gap-1 text-muted-foreground">
                <p>Name: {address.name}</p>
                <p>Phone: {address.phone}</p>
                <p>{address.country}</p>
                <p>{address.governorate}</p>
                <p>{address.city}</p>
                <p>{address.streetAddress}</p>
            </div>
            <div className="flex justify-between gap-2 flex-wrap mt-5">
                <div className="flex justify-between gap-2 flex-wrap">
                    {!(address.isDefault) && (
                        <SetAsDefaultButton addressId={address.id} />
                    )}
                    <EditAddressButton address={address} userHasMoreThanOneAddress={userHasMoreThanOneAddress} />
                </div>
                <DeleteAddressButton addressId={address.id} />
            </div>
        </div>
    )
}

export default AddressCard