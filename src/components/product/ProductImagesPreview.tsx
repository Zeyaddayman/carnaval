"use client"

import Image from "next/image"
import { useState } from "react"

interface Props {
    images: string[]
    title: string
}

const ProductImagesPreview = ({ images, title }: Props) => {

    const [selectedImage, setSelectedImage] = useState(images[0])

    const handleChangeImage = (image: string) => setSelectedImage(image)

    return (
        <div className="flex-1 bg-card p-3 rounded-lg space-y-3">
            <div className="relative w-full h-[40vh] lg:h-[60vh]">
                <Image
                    src={selectedImage}
                    alt={`${title}-main_image`}
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            {images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                    {images.map(image => (
                        <div
                            key={image}
                            onClick={() => handleChangeImage(image)}
                            className={`${image === selectedImage ? "border-primary": "border-border"} border-2 rounded-md cursor-pointer transition`}
                        >
                            <Image
                                src={image}
                                alt={`${title}-sub_image`}
                                width={100}
                                height={100}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductImagesPreview