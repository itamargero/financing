'use client'

import { useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useDashboardAnalytics } from '@/hooks/use-analytics'
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Building2,
  UserCheck,
  MessageSquare,
  PlusCircle,
  Settings,
  BarChart3,
  Activity
} from 'lucide-react'

// Statistics Card Component
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue' 
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  color?: 'blue' | 'green' | 'orange' | 'purple'
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50', 
    orange: 'text-orange-600 bg-orange-50',
    purple: 'text-purple-600 bg-purple-50'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    { 
      name: 'View Lenders', 
      icon: Building2, 
      color: 'bg-blue-600 hover:bg-blue-700',
      href: '/lenders'
    },
    { 
      name: 'Create Blog Post', 
      icon: FileText, 
      color: 'bg-green-600 hover:bg-green-700',
      href: '/blog/new'
    },
    { 
      name: 'View Leads', 
      icon: Users, 
      color: 'bg-purple-600 hover:bg-purple-700',
      href: '/leads'
    },
    { 
      name: 'Analytics', 
      icon: BarChart3, 
      color: 'bg-orange-600 hover:bg-orange-700',
      href: '/analytics'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <a
            key={action.name}
            href={action.href}
            className={`${action.color} text-white p-3 rounded-lg flex items-center space-x-2 transition-colors block text-center`}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{action.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// Recent Activity Component (placeholder)
function RecentActivity() {
  const activities = [
    { type: 'lead', message: 'New lead from Juan Cruz', time: '2 minutes ago' },
    { type: 'lender', message: 'BPI Personal Loan was verified', time: '1 hour ago' },
    { type: 'blog', message: 'Blog post "Top Loans 2024" published', time: '3 hours ago' },
    { type: 'lead', message: 'Lead assigned to Maria Santos', time: '5 hours ago' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const { data: analytics, loading: analyticsLoading } = useDashboardAnalytics()

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the admin panel.</p>
          <a 
            href="/sign-in"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
          >
            Sign In
          </a>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financing.ph Admin</h1>
              <p className="text-gray-600">Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}</p>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analyticsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Lenders"
                value={analytics?.lenders?.total || 0}
                subtitle={`${analytics?.lenders?.active || 0} active`}
                icon={Building2}
                color="blue"
              />
              <StatCard
                title="Total Leads"
                value={analytics?.leads?.total || 0}
                subtitle={`${analytics?.leads?.recent || 0} this month`}
                icon={Users}
                color="green"
              />
              <StatCard
                title="Blog Posts"
                value={analytics?.blog?.published || 0}
                subtitle={`${analytics?.blog?.drafts || 0} drafts`}
                icon={FileText}
                color="purple"
              />
              <StatCard
                title="New Leads"
                value={analytics?.leads?.by_status?.new || 0}
                subtitle="Awaiting contact"
                icon={Activity}
                color="orange"
              />
            </div>

            {/* Lead Status Overview */}
            {analytics?.leads?.by_status && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(analytics.leads.by_status).map(([status, count]) => (
                    <div key={status} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600 capitalize">{status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <QuickActions />
              </div>
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}