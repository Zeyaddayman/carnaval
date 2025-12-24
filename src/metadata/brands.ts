import { getBrands } from "@/server/db/brands";
import { Metadata } from "next";

const brands = await getBrands()
const topBrandsNames = brands.slice(0, 20).map(brand => brand.name).join(", ")

export const brandsMetadata: Metadata = {
    title: 'Shop by Brand',
    description: `Explore products from top brands at Carnaval. Browse ${topBrandsNames}, and more. Find products from your favorite brands!`,
    keywords: ['brands', 'shop by brand', 'top brands', 'popular brands', 'online shopping'].concat(topBrandsNames.split(", ")),
    openGraph: {
        title: 'Shop by Brand | Carnaval',
        description: `Explore products from top brands at Carnaval. Browse ${topBrandsNames}, and more. Find products from your favorite brands!`
    }
}