import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { note } = await request.json()
    
    if (!note || note.trim() === '') {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      )
    }

    const lead = await db.leads.addNote(id, note.trim(), userId)
    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error adding note to lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}