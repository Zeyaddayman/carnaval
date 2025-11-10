const WishlistItemsSkeleton = () => {
    return (
        <div role={"status"} className="animate-pulse">
            <div className="bg-gray-200 h-6 w-26 mb-3 rounded-full"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="relative flex flex-col gap-3 p-3 bg-card border border-border rounded-lg">
                        <div>
                            <div className="w-full flex justify-center items-center aspect-square border border-border rounded-md">
                                <svg className="w-7/10 h-7/10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                                </svg>
                            </div>
                            <div className="bg-gray-200 h-6 sm:h-7 w-4/5 mb-1 mt-2 rounded-full"></div>
                            <div className="bg-gray-200 h-5 w-3/5 rounded-full"></div>
                            <div className="bg-gray-200 h-5 w-31 my-3 rounded-full"></div>
                            <div className="flex items-center flex-wrap gap-3">
                                <div className="bg-gray-200 h-7 w-13 rounded-full"></div>
                                <div className="bg-gray-200 h-7 w-13 rounded-full"></div>
                                <div className="bg-gray-200 h-7 w-10 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="bg-gray-200 h-9 rounded-md"></div>
                            <div className="bg-gray-200 h-9 rounded-md"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WishlistItemsSkeleton