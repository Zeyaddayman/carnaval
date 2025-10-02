import { verifyToken } from '@/server/tokens'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {

    const accessToken = (await cookies()).get("accessToken")

    const session = verifyToken(accessToken?.value || "")

    console.log("user checking his session...")

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(session, { status: 200 })
}