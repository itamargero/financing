'use client'

import { useRouter } from 'next/navigation'
import { LenderForm } from '@/components/lender-form'

export default function NewLenderPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/lenders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/lenders')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create lender')
      }
    } catch (error) {
      console.error('Error creating lender:', error)
      alert('Failed to create lender. Please try again.')
    }
  }

  const handleCancel = () => {
    router.push('/lenders')
  }

  return (
    <LenderForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={false}
    />
  )
}