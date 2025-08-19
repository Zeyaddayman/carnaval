

import ExploreCollections from "@/components/home/ExploreCollections"
import Hero from "@/components/home/Hero"

export default function Home() {
    return (
        <main>
            <div className="container">
                <Hero />
                <ExploreCollections />
            </div>
        </main>
    )
}
