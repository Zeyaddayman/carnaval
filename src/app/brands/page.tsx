import ProductsBrands from "@/components/brands/ProductsBrands"
import { brandsMetadata } from "@/metadata/brands"

export const metadata = brandsMetadata

const BrandsPage = () => {
    return (
        <main>
            <div className="container">
                <ProductsBrands />
            </div>
        </main>
    )
}

export default BrandsPage