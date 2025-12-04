import ProfileSidebar from "@/components/profile/ProfileSidebar"
import { isAuthenticated } from "@/server/utils/auth"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

const ProfileLayout = async ({ children }: { children: ReactNode }) => {

    const session = await isAuthenticated()

    if (!session) {
        redirect('/auth/login?redirect=/profile')
    }

    return (
        <main>
            <div className="container">
                <div className="flex gap-5">
                    <ProfileSidebar session={session} />
                    <div className="flex-1 overflow-x-auto">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProfileLayout