import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    const { name, slug, description } = body
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Create slug from name if not provided
    const finalSlug = slug || name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const lenderData = {
      name,
      slug: finalSlug,
      description,
      logo_url: body.logo_url,
      website_url: body.website_url,
      phone: body.phone,
      email: body.email,
      address: body.address,
      rating: body.rating || 0,
      review_count: body.review_count || 0,
      is_verified: body.is_verified || false,
      is_active: body.is_active !== false, // Default to true
      minimum_loan_amount: body.minimum_loan_amount,
      maximum_loan_amount: body.maximum_loan_amount,
      minimum_interest_rate: body.minimum_interest_rate,
      maximum_interest_rate: body.maximum_interest_rate,
      processing_time_days: body.processing_time_days,
      requirements: body.requirements || []
    }

    const lender = await db.lenders.create(lenderData)
    return NextResponse.json(lender, { status: 201 })
  } catch (error) {
    console.error('Error creating lender:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}