import Image from "next/image"

const NoSavedAddresses = () => {
    return (
        <div className="flex justify-center items-center mt-10">
            <div className="text-center">
                <Image
                    src={"/images/map.svg"}
                    alt="no-saved-addresses"
                    className="mx-auto"
                    width={250}
                    height={202}
                />
                <h3 className="text-2xl font-bold mt-5">No Saved Addresses Yet!</h3>
                <p className="text-muted-foreground my-3">Let's add your first address</p>
            </div>
        </div>
    )
}

export default NoSavedAddresses