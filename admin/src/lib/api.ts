// API client utilities for admin frontend
interface Lender {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website_url?: string
  phone?: string
  email?: string
  address?: string
  rating: number
  review_count: number
  is_verified: boolean
  is_active: boolean
  minimum_loan_amount?: number
  maximum_loan_amount?: number
  minimum_interest_rate?: number
  maximum_interest_rate?: number
  processing_time_days?: number
  requirements?: string[]
  created_at: string
  updated_at: string
}

const API_BASE = '/api'

// Generic API functions
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Lender API
export const lenderApi = {
  getAll: () => apiRequest<Lender[]>('/lenders'),
  getById: (id: string) => apiRequest<Lender>(`/lenders/${id}`),
  create: (data: Omit<Lender, 'id' | 'created_at' | 'updated_at'>) =>
    apiRequest<Lender>('/lenders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Lender>) =>
    apiRequest<Lender>(`/lenders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/lenders/${id}`, {
      method: 'DELETE',
    }),
  verify: (id: string) =>
    apiRequest<Lender>(`/lenders/${id}/verify`, {
      method: 'POST',
    }),
  toggleStatus: (id: string, isActive: boolean) =>
    apiRequest<Lender>(`/lenders/${id}/toggle-status`, {
      method: 'POST',
      body: JSON.stringify({ isActive }),
    }),
}

// Lead API
export const leadApi = {
  getAll: (filters?: { status?: string; lenderId?: string; limit?: number }) => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.lenderId) params.append('lenderId', filters.lenderId)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const query = params.toString()
    return apiRequest<Lead[]>(`/leads${query ? `?${query}` : ''}`)
  },
  getById: (id: string) => apiRequest<Lead>(`/leads/${id}`),
  updateStatus: (id: string, status: string, notes?: string) =>
    apiRequest<Lead>(`/leads/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    }),
  assign: (id: string, assignedTo: string) =>
    apiRequest<Lead>(`/leads/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ assignedTo }),
    }),
  addNote: (id: string, note: string) =>
    apiRequest<Lead>(`/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
  getStatistics: () =>
    apiRequest<{ total: number; by_status: Record<string, number> }>('/leads/statistics'),
}

// Blog API
export const blogApi = {
  posts: {
    getAll: (filters?: { status?: string; featured?: boolean; limit?: number }) => {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.featured !== undefined) params.append('featured', filters.featured.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())
      
      const query = params.toString()
      return apiRequest<BlogPost[]>(`/blog/posts${query ? `?${query}` : ''}`)
    },
    getById: (id: string) => apiRequest<BlogPost>(`/blog/posts/${id}`),
    create: (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author_id'>) =>
      apiRequest<BlogPost>('/blog/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<BlogPost>) =>
      apiRequest<BlogPost>(`/blog/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiRequest<{ success: boolean }>(`/blog/posts/${id}`, {
        method: 'DELETE',
      }),
    publish: (id: string) =>
      apiRequest<BlogPost>(`/blog/posts/${id}/publish`, {
        method: 'POST',
      }),
    unpublish: (id: string) =>
      apiRequest<BlogPost>(`/blog/posts/${id}/publish`, {
        method: 'DELETE',
      }),
  },
  categories: {
    getAll: () => apiRequest<BlogCategory[]>('/blog/categories'),
    create: (data: Omit<BlogCategory, 'id' | 'created_at'>) =>
      apiRequest<BlogCategory>('/blog/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
}

// Analytics API
export const analyticsApi = {
  getDashboardStats: () =>
    apiRequest<{
      lenders: { total: number; active: number; inactive: number }
      leads: { total: number; recent: number; by_status: Record<string, number> }
      blog: { published: number; drafts: number; total: number }
    }>('/analytics/dashboard'),
}

// Upload API
export const uploadApi = {
  uploadFile: async (file: File, folder: string = 'general', bucket: string = 'uploads') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('bucket', bucket)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json() as Promise<{
      success: boolean
      url: string
      path: string
      filename: string
      size: number
      type: string
    }>
  },
  deleteFile: (path: string, bucket: string = 'uploads') =>
    apiRequest<{ success: boolean }>(`/upload?path=${encodeURIComponent(path)}&bucket=${bucket}`, {
      method: 'DELETE',
    }),
}