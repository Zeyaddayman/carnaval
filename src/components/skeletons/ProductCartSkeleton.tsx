const ProductCartSkeleton = () => {
    return (
        <div role="status" className='flex gap-3 flex-wrap animate-pulse'>
            <div className='flex-1 flex gap-2 items-center min-h-10'>
                <div className="bg-gray-200 min-w-16 h-6 rounded-full"></div>
                <div className="bg-gray-200 min-w-10 h-9 rounded-md"></div>
                <div className="bg-gray-200 w-full min-w-30 h-10 rounded-md"></div>
                <div className="bg-gray-200 min-w-11 h-9 rounded-md"></div>
            </div>
            <div className="bg-gray-200 flex-1 min-w-34 h-10 rounded-md"></div>
        </div>
    )
}

export default ProductCartSkeleton