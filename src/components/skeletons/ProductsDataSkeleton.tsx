import { PROUDCTS_PAGE_LIMIT } from "@/constants/products"

const ProductsDataSkeleton = () => {
    return (
        <div role={"status"} className="animate-pulse">
            <div className="w-56 h-6 my-3 bg-gray-200 rounded-full"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5">
                {Array.from({ length: PROUDCTS_PAGE_LIMIT }).map((_,i) => (
                    <div key={i} className="bg-card p-3 border border-border rounded-lg">
                        <div className="w-full flex justify-center items-center aspect-square border border-border rounded-md">
                            <svg className="w-7/10 h-7/10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                            </svg>
                        </div>
                        <div className="bg-gray-200 w-full h-6 lg:h-7 mt-2 mb-1 rounded-full"></div>
                        <div className="bg-gray-200 w-full h-6 lg:h-7 mb-1 rounded-full"></div>
                        <div className="bg-gray-200 w-1/2 h-5 rounded-full"></div>
                        <div className="bg-gray-200 w-3/4 h-6 rounded-full my-3"></div>
                        <div className="bg-gray-200 w-9/10 h-7 rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductsDataSkeleton