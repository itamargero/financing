'use client'

import { useState } from 'react'
import { useLenders } from '@/hooks/use-lenders'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Shield,
  Globe,
  Phone,
  Mail
} from 'lucide-react'

// Lender Status Badge Component
function StatusBadge({ isActive, isVerified }: { isActive: boolean; isVerified: boolean }) {
  if (!isActive) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <X className="w-3 h-3 mr-1" />
        Inactive
      </span>
    )
  }
  
  if (isVerified) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Shield className="w-3 h-3 mr-1" />
        Verified
      </span>
    )
  }
  
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      Pending
    </span>
  )
}

// Lender Card Component
function LenderCard({ lender, onVerify, onToggleStatus, onEdit, onDelete }: {
  lender: any
  onVerify: (id: string) => void
  onToggleStatus: (id: string, isActive: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            {lender.logo_url ? (
              <img 
                src={lender.logo_url} 
                alt={lender.name}
                className="w-8 h-8 rounded object-cover"
              />
            ) : (
              <Building2 className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{lender.name}</h3>
            <p className="text-sm text-gray-500">/{lender.slug}</p>
          </div>
        </div>
        <StatusBadge isActive={lender.is_active} isVerified={lender.is_verified} />
      </div>
      
      {lender.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lender.description}</p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          {lender.website_url && (
            <span className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>Website</span>
            </span>
          )}
          {lender.phone && (
            <span className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </span>
          )}
          {lender.email && (
            <span className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </span>
          )}
        </div>
        <div className="text-right">
          <div>Rating: {lender.rating}/5</div>
          <div>{lender.review_count} reviews</div>
        </div>
      </div>
      
      {(lender.minimum_loan_amount || lender.maximum_loan_amount) && (
        <div className="text-sm text-gray-600 mb-4">
          Loan Range: ₱{lender.minimum_loan_amount?.toLocaleString()} - ₱{lender.maximum_loan_amount?.toLocaleString()}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(lender.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(lender.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex space-x-2">
          {!lender.is_verified && (
            <button
              onClick={() => onVerify(lender.id)}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Verify
            </button>
          )}
          <button
            onClick={() => onToggleStatus(lender.id, !lender.is_active)}
            className={`px-3 py-1 text-sm rounded ${
              lender.is_active
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {lender.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LendersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'verified' | 'unverified'>('all')
  
  const { 
    lenders, 
    loading, 
    error, 
    verifyLender, 
    toggleLenderStatus, 
    deleteLender 
  } = useLenders()

  const filteredLenders = lenders?.filter(lender => {
    const matchesSearch = lender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lender.slug.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && lender.is_active) ||
      (filterStatus === 'inactive' && !lender.is_active) ||
      (filterStatus === 'verified' && lender.is_verified) ||
      (filterStatus === 'unverified' && !lender.is_verified)
    
    return matchesSearch && matchesFilter
  }) || []

  const handleVerify = async (id: string) => {
    try {
      await verifyLender(id)
    } catch (error) {
      console.error('Failed to verify lender:', error)
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleLenderStatus(id, isActive)
    } catch (error) {
      console.error('Failed to toggle lender status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lender?')) {
      try {
        await deleteLender(id)
      } catch (error) {
        console.error('Failed to delete lender:', error)
      }
    }
  }

  const handleEdit = (id: string) => {
    window.location.href = `/lenders/${id}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading lenders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Lenders</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <nav className="flex items-center space-x-4 text-sm">
              <a href="/" className="text-blue-600 hover:text-blue-800">← Dashboard</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">Lenders</span>
            </nav>
          </div>
          <div className="flex justify-between items-center pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lenders</h1>
              <p className="text-gray-600">Manage loan providers and their information</p>
            </div>
            <a href="/lenders/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Lender</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search lenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Lenders</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{lenders?.length || 0}</div>
            <div className="text-sm text-gray-600">Total Lenders</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">
              {lenders?.filter(l => l.is_active).length || 0}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-purple-600">
              {lenders?.filter(l => l.is_verified).length || 0}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-orange-600">
              {lenders?.filter(l => !l.is_verified).length || 0}
            </div>
            <div className="text-sm text-gray-600">Pending Verification</div>
          </div>
        </div>

        {/* Lenders Grid */}
        {filteredLenders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lenders found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first lender.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLenders.map((lender) => (
              <LenderCard
                key={lender.id}
                lender={lender}
                onVerify={handleVerify}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}