import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const lenders = await db.lenders.getAll()
    return NextResponse.json(lenders)
  } catch (error) {
    console.error('Error fetching lenders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}