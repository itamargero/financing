import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { assignedTo } = await request.json()
    
    if (!assignedTo) {
      return NextResponse.json(
        { error: 'assignedTo is required' },
        { status: 400 }
      )
    }

    const lead = await db.leads.assignTo(id, assignedTo, userId)
    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error assigning lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}