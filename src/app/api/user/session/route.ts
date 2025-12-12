import { isAuthenticated } from '@/server/utils/auth'
import { NextResponse } from 'next/server'

export async function GET() {

    const session = await isAuthenticated()

    return NextResponse.json(session, { status: 200 })
}