'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  Clock,
  Percent,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react'

interface LenderFormData {
  name: string
  slug: string
  description: string
  logo_url: string
  website_url: string
  phone: string
  email: string
  address: string
  rating: number
  review_count: number
  is_verified: boolean
  is_active: boolean
  minimum_loan_amount: number
  maximum_loan_amount: number
  minimum_interest_rate: number
  maximum_interest_rate: number
  processing_time_days: number
  requirements: string[]
}

interface LenderFormProps {
  lender?: any
  onSubmit: (data: LenderFormData) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

export function LenderForm({ lender, onSubmit, onCancel, isEditing = false }: LenderFormProps) {
  const [formData, setFormData] = useState<LenderFormData>({
    name: lender?.name || '',
    slug: lender?.slug || '',
    description: lender?.description || '',
    logo_url: lender?.logo_url || '',
    website_url: lender?.website_url || '',
    phone: lender?.phone || '',
    email: lender?.email || '',
    address: lender?.address || '',
    rating: lender?.rating || 0,
    review_count: lender?.review_count || 0,
    is_verified: lender?.is_verified || false,
    is_active: lender?.is_active !== undefined ? lender.is_active : true,
    minimum_loan_amount: lender?.minimum_loan_amount || 0,
    maximum_loan_amount: lender?.maximum_loan_amount || 0,
    minimum_interest_rate: lender?.minimum_interest_rate || 0,
    maximum_interest_rate: lender?.maximum_interest_rate || 0,
    processing_time_days: lender?.processing_time_days || 1,
    requirements: lender?.requirements || ['Valid ID', 'Proof of Income']
  })

  const [loading, setLoading] = useState(false)
  const [newRequirement, setNewRequirement] = useState('')

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting lender:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Lender' : 'Add New Lender'}
              </h1>
              <p className="text-gray-600">
                {isEditing ? 'Update lender information' : 'Create a new lender profile'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lender Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isEditing}
                />
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">Slug cannot be changed for existing lenders</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://www.lender.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+63-2-1234-5678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="contact@lender.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Metro Manila, Philippines"
                />
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Loan Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Loan Amount (₱)
                </label>
                <input
                  type="number"
                  value={formData.minimum_loan_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimum_loan_amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Loan Amount (₱)
                </label>
                <input
                  type="number"
                  value={formData.maximum_loan_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, maximum_loan_amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4 inline mr-1" />
                  Minimum Interest Rate (% monthly)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minimum_interest_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimum_interest_rate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Percent className="w-4 h-4 inline mr-1" />
                  Maximum Interest Rate (% monthly)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.maximum_interest_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, maximum_interest_rate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Processing Time (days)
                </label>
                <input
                  type="number"
                  value={formData.processing_time_days}
                  onChange={(e) => setFormData(prev => ({ ...prev, processing_time_days: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="5"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Requirements
            </h2>
            
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => {
                      const newReqs = [...formData.requirements]
                      newReqs[index] = e.target.value
                      setFormData(prev => ({ ...prev, requirements: newReqs }))
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add new requirement..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active (visible to users)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_verified"
                  checked={formData.is_verified}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_verified" className="ml-2 text-sm text-gray-700">
                  Verified lender
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : isEditing ? 'Update Lender' : 'Create Lender'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}