const OrdersTableSkeleton = () => {
    return (
    <div className="relative overflow-x-auto bg-card border border-border rounded-md">
            <table className="w-full text-center">
                <thead className="bg-white text-muted-foreground">
                    <tr>
                        <th scope="col" className="py-3 px-4 font-medium">ID</th>
                        <th scope="col" className="py-3 px-4 font-medium">Date</th>
                        <th scope="col" className="py-3 px-4 font-medium">Items</th>
                        <th scope="col" className="py-3 px-4 font-medium">Status</th>
                        <th scope="col" className="py-3 px-4 font-medium">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 3 }, (_, i) => i).map(i => (
                        <tr key={i} className="h-12 even:bg-white odd:bg-transparent"></tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OrdersTableSkeleton