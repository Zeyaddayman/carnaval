import { buttonVariants } from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import { getProfile } from "@/server/db/profile"
import Link from "next/link"

const ProfileAccountOverviewPage = async () => {

    const profile = await getProfile()

    return (
        <>
        <Heading
            title="Account Overview"
        />
        <div className="grid md:grid-cols-2 gap-5">
            <section className="px-3 py-6 bg-card border border-border rounded-md">
                <h5 className="text-xl font-semibold mb-5">Personal Inforamtion</h5>
                <div className="flex flex-col gap-3 text-muted-foreground">
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <p>Phone: {profile.phone}</p>
                </div>
                <Link
                    href={"/profile/settings"}
                    className={`${buttonVariants({ variant: "secondary" })} mt-6`}
                >
                    Edit Profile
                </Link>
            </section>
            <section className="bg-card border border-border rounded-md"></section>
        </div>
        </>
    )
}

export default ProfileAccountOverviewPage