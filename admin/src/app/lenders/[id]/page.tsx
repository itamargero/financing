'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LenderForm } from '@/components/lender-form'

interface EditLenderPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditLenderPage({ params }: EditLenderPageProps) {
  const router = useRouter()
  const [lender, setLender] = useState(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      fetchLender(id)
    })
  }, [params])

  const fetchLender = async (lenderId: string) => {
    try {
      const response = await fetch(`/api/lenders/${lenderId}`)
      if (response.ok) {
        const lenderData = await response.json()
        setLender(lenderData)
      } else {
        throw new Error('Failed to fetch lender')
      }
    } catch (error) {
      console.error('Error fetching lender:', error)
      alert('Failed to load lender data')
      router.push('/lenders')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    if (!id) return

    try {
      const response = await fetch(`/api/lenders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/lenders')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update lender')
      }
    } catch (error) {
      console.error('Error updating lender:', error)
      alert('Failed to update lender. Please try again.')
    }
  }

  const handleCancel = () => {
    router.push('/lenders')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading lender...</p>
        </div>
      </div>
    )
  }

  if (!lender) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lender Not Found</h2>
          <p className="text-gray-600">The requested lender could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <LenderForm
      lender={lender}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={true}
    />
  )
}