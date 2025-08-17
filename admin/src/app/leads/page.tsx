'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  Users,
  Phone,
  Mail,
  Building2,
  Calendar,
  Filter,
  MoreHorizontal,
  User,
  FileText,
  Check,
  X,
  Clock
} from 'lucide-react'

interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  loan_amount: number
  loan_purpose: string
  employment_status: string
  monthly_income: number
  status: string
  source: string
  lender_name?: string
  created_at: string
  updated_at: string
}

function LeadCard({ lead, onStatusUpdate }: { lead: Lead; onStatusUpdate: (id: string, status: string) => void }) {
  const [showDropdown, setShowDropdown] = useState(false)
  
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    closed: 'bg-gray-100 text-gray-800'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {lead.first_name} {lead.last_name}
            </h3>
            <p className="text-sm text-gray-500">Lead #{lead.id.slice(0, 8)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {lead.status}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                <div className="py-1">
                  <button
                    onClick={() => { onStatusUpdate(lead.id, 'contacted'); setShowDropdown(false) }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => { onStatusUpdate(lead.id, 'qualified'); setShowDropdown(false) }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Qualified
                  </button>
                  <button
                    onClick={() => { onStatusUpdate(lead.id, 'rejected'); setShowDropdown(false) }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Mark as Rejected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          <span>{lead.phone || 'No phone'}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Loan Amount:</span>
          <span className="font-medium">{formatCurrency(lead.loan_amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Purpose:</span>
          <span className="font-medium">{lead.loan_purpose}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Monthly Income:</span>
          <span className="font-medium">{formatCurrency(lead.monthly_income)}</span>
        </div>
        {lead.lender_name && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Lender:</span>
            <span className="font-medium">{lead.lender_name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(lead.created_at)}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          Source: {lead.source}
        </div>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const { user, isLoaded } = useUser()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isLoaded && user) {
      fetchLeads()
    }
  }, [isLoaded, user, statusFilter])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      const response = await fetch(`/api/leads?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Refresh leads
        fetchLeads()
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const getStatusCounts = () => {
    const counts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      all: leads.length,
      new: counts.new || 0,
      contacted: counts.contacted || 0,
      qualified: counts.qualified || 0,
      approved: counts.approved || 0,
      rejected: counts.rejected || 0,
      closed: counts.closed || 0
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access the leads management.</p>
        </div>
      </div>
    )
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
              <p className="text-gray-600">Manage and track loan application leads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            <button
              onClick={() => setStatusFilter('all')}
              className={`text-center p-3 rounded-lg border transition-colors ${
                statusFilter === 'all' ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">All Leads</div>
            </button>
            
            {['new', 'contacted', 'qualified', 'approved', 'rejected', 'closed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-center p-3 rounded-lg border transition-colors ${
                  statusFilter === status ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl font-bold text-gray-900">{statusCounts[status as keyof typeof statusCounts]}</div>
                <div className="text-sm text-gray-600 capitalize">{status}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Leads Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No leads have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onStatusUpdate={updateLeadStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}