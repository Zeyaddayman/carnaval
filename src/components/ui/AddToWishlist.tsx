import { FaHeart } from "react-icons/fa"

const AddToWishlist = () => {
    return (
        <span className="group w-12 h-12 bg-white element-center rounded-full cursor-pointer">
            <FaHeart fill="transparent" strokeWidth={20} size={20} className="group-hover:fill-red-500 group-hover:stroke-red-500 transition-colors" />
        </span>
    )
}

export default AddToWishlist