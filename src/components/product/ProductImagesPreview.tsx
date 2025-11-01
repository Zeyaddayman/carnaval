"use client"

import Image from "next/image"
import { useState } from "react"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"

interface Props {
    images: string[]
}

const ProductImagesPreview = ({ images }: Props) => {

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const handleChangeImage = (index: number) => {
        if (index >= 0 && index < images.length) {
            setSelectedImageIndex(index)
        }
    }

    return (
        <div className="flex-1 bg-card p-3 rounded-lg space-y-3 visible">
            <div className="relative w-full h-[40vh] lg:h-[60vh]">
                {images.map(imageUrl => (
                    <Image
                        key={imageUrl}
                        src={imageUrl}
                        alt={`main_image`}
                        fill
                        sizes="(max-width: 1024px) 90vw, 40vw"
                        className={`object-contain ${images[selectedImageIndex] === imageUrl ? "visible": "invisible"}`}
                        priority={images[selectedImageIndex] === imageUrl}
                    />
                ))}
                <button
                    className={`${selectedImageIndex === 0 ? "hidden": ""} absolute lg:hidden top-1/2 left-5 -translate-y-1/2 p-3 rounded-full bg-white cursor-pointer`}
                    onClick={() => handleChangeImage(selectedImageIndex - 1)}
                >
                    <MdKeyboardArrowLeft size={20} />
                </button>
                <button
                    className={`${selectedImageIndex === images.length - 1 ? "hidden": ""} absolute lg:hidden top-1/2 right-5 -translate-y-1/2 p-3 rounded-full bg-white cursor-pointer`}
                    onClick={() => handleChangeImage(selectedImageIndex + 1)}
                >
                    <MdKeyboardArrowRight size={20} />
                </button>
            </div>
            {images.length > 1 && (
                <div className="hidden lg:flex gap-3 flex-wrap">
                    {images.map((image, index) => (
                        <div
                            key={image}
                            className={`${index === selectedImageIndex ? "border-primary": "border-border"} p-3 border-2 rounded-md cursor-pointer transition`}
                            onClick={() => handleChangeImage(index)}
                        >
                            <Image
                                src={image}
                                alt={`sub_image`}
                                width={100}
                                height={100}
                                className="object-contain aspect-square"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductImagesPreview