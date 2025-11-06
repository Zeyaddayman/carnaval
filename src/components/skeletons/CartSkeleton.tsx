const CartSkeleton = () => {
    return (
        <div role={"status"} className="flex flex-col lg:flex-row gap-5 animate-pulse">
            {/* cart items */}
            <div className="flex-1 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card p-2 flex flex-col md:flex-row gap-3 border border-border rounded-md">
                        <div className="flex justify-center items-center self-center w-[150px] h-[150px] border-border">
                            <svg className="w-7/10 h-7/10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex gap-2 justify-between">
                                <div>
                                    <div className="bg-gray-200 h-6 w-65 rounded-full"></div>
                                    <div className="bg-gray-200 h-6 w-31 my-2 rounded-full"></div>
                                    <div className="bg-gray-200 h-4 w-22 rounded-full"></div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="bg-gray-200 h-8 w-14 mb-2 rounded-full"></div>
                                    <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
                                    <div className="flex gap-2 items-center mt-0.5">
                                        <div className="bg-gray-200 h-5 w-8 rounded-full"></div>
                                        <div className="bg-gray-200 h-6 w-8 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-between min-h-10 mt-5">
                                <div className='flex items-center gap-2'>
                                    <div className="bg-gray-200 w-10 h-9 rounded-md"></div>
                                    <div className="bg-gray-200 w-20 h-10 rounded-md"></div>
                                    <div className="bg-gray-200 w-11 h-9 rounded-md"></div>
                                    <div className="min-w-20 h-9"></div>
                                </div>
                                <div className="bg-gray-200 w-25.5 h-9 rounded-md"></div>
                            </div>
                            <div className="bg-gray-200 w-40 h-9 mt-5 rounded-md"></div>
                        </div>
                    </div>
                ))}
            </div>
            {/* order summary */}
            <div className="bg-card min-w-80 max-w-full p-4 sticky top-5 h-84 rounded-md border border-border">
                <div className="bg-gray-200 h-5 w-40 rounded-full"></div>
                <div className="bg-gray-200 h-7 w-38 my-3 rounded-full"></div>
                <div className="bg-border h-[1px] w-full"></div>
                <div className="space-y-2 my-3">
                    <div className="flex h-fit justify-between">
                        <div className="bg-gray-200 h-6 w-15 rounded-full"></div>
                        <div className="bg-gray-200 h-6 w-8 rounded-full"></div>
                    </div>
                    <div className="flex justify-between">
                        <div className="bg-gray-200 h-6 w-18 rounded-full"></div>
                        <div className="bg-gray-200 h-6 w-12 rounded-full"></div>
                    </div>
                    <div className="flex justify-between">
                        <div className="bg-gray-200 h-6 w-18 rounded-full"></div>
                        <div className="bg-gray-200 h-6 w-10 rounded-full"></div>
                    </div>
                </div>
                <div className="bg-border h-[1px] w-full"></div>
                <div className="flex justify-between my-3">
                    <div className="bg-gray-200 h-8 w-15 rounded-full"></div>
                    <div className="bg-gray-200 h-8 w-15 rounded-full"></div>
                </div>
                <div className="bg-border h-[1px] w-full"></div>
                <div className="bg-gray-200 h-10 mt-4 rounded-md"></div>
            </div>
        </div>
    )
}

export default CartSkeleton