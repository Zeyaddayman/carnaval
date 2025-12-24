import Link from "next/link"
import { buttonVariants } from "../ui/Button"

const Hero = () => {
    return (
        <section className="min-h-[75vh] bg-secondary element-center flex-col gap-8 px-4 md:px-20 py-4 text-center rounded-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Discover Your Style at Carnaval</h1>
            <p className="text-xl text-secondary-foreground">Explore a world of fashion, electronics, home goods, and more. Find everything you need with ease and confidence</p>
            <Link
                href={"/categories"}
                className={`${buttonVariants({ variant: "primary", size: "lg" })} w-fit mx-auto`}
            >
                SHOP NOW
            </Link>
        </section>
    )
}

export default Hero