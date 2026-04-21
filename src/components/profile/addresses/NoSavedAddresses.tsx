import { Translation } from "@/types/translation"
import Image from "next/image"

const NoSavedAddresses = ({ translation }: { translation: Translation["profile"]["addresses"]["noSavedAddresses"] }) => {
    return (
        <div className="flex justify-center items-center mt-10">
            <div className="text-center">
                <Image
                    src={"/images/map.svg"}
                    alt="Map"
                    className="mx-auto"
                    width={250}
                    height={202}
                    priority
                />
                <h3 className="text-2xl font-bold mt-5">{translation.title}</h3>
                <p className="text-muted-foreground my-3">{translation.subTitle}</p>
            </div>
        </div>
    )
}

export default NoSavedAddresses