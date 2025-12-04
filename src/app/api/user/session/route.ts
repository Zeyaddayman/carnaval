import { isAuthenticated } from '@/server/utils/auth'
import { NextResponse } from 'next/server'

export async function GET() {

    const session = await isAuthenticated()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(session, { status: 200 })
}