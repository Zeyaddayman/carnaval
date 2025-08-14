import ProductsBrands from "@/components/brands/ProductsBrands"
import SectionHeading from "@/components/ui/SectionHeading"

const BrandsPage = () => {
    return (
        <main>
            <section>
                <SectionHeading
                    title="Explore Our Brands"
                    subTitle="Discover products from your favorite brands."
                />
                <ProductsBrands />
            </section>
        </main>
    )
}

export default BrandsPage