import { buttonVariants } from "@/components/ui/Button"
import Image from "next/image"
import Link from "next/link"

const NotFound = () => {
    return (
        <main>
            <div className="container">
                <div className="flex w-full h-[70vh] justify-center items-center">
                    <div className="text-center">
                        <Image
                            src={"/images/not-found.svg"}
                            alt="Not found"
                            width={300}
                            height={199}
                        />
                        <h1 className="text-3xl font-bold mt-5">Not Found</h1>
                        <p className="text-muted-foreground my-3">The page you are looking for does not exist.</p>
                        <Link
                            href={"/"}
                            className={`${buttonVariants({ variant: "primary", size: "lg" })}`}
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NotFound