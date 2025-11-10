const ProductCartSkeleton = () => {
    return (
        <div role="status" className='flex-1 flex gap-2 items-center flex-wrap animate-pulse'>
            <div className="bg-gray-200 w-16 h-6 rounded-full"></div>
            <div className="bg-gray-200 w-10 h-9 rounded-md"></div>
            <div className="bg-gray-200 flex-1 min-w-30 h-9 rounded-md"></div>
            <div className="bg-gray-200 w-10 h-9 rounded-md"></div>
            <div className="bg-gray-200 flex-1 min-w-34 h-9 rounded-md"></div>
        </div>
    )
}

export default ProductCartSkeleton