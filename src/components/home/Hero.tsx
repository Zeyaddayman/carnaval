import Link from "next/link"
import { buttonVariants } from "../ui/Button"

const Hero = () => {
    return (
        <section className="container">
            <div className="min-h-[75vh] bg-secondary element-center flex-col gap-8 px-4 lg:px-20 py-4 text-center rounded-lg">
                <h1 className="text-4xl lg:text-5xl font-bold text-primary">Discover Your Style at Carnaval</h1>
                <p className="text-xl text-secondary-foreground">Explore a world of fashion, electronics, home goods, and more. Find everything you need with ease and confidence</p>
                <Link
                    href={"/categories"}
                    className={`${buttonVariants({ variant: "default", size: "lg" })} w-fit mx-auto`}
                >
                    Shop Now
                </Link>
            </div>
        </section>
    )
}

export default Hero