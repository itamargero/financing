import { supabase, supabaseAdmin } from './supabase'

// Database utility functions for admin operations
export const db = {
  // Lenders
  lenders: {
    async getAll() {
      const { data, error } = await supabase
        .from('lenders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('lenders')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(lender: Omit<Lender, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabaseAdmin
        .from('lenders')
        .insert(lender)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<Lender>) {
      const { data, error } = await supabaseAdmin
        .from('lenders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string) {
      const { error } = await supabaseAdmin
        .from('lenders')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },

    async toggleStatus(id: string, isActive: boolean) {
      return this.update(id, { is_active: isActive })
    },

    async verify(id: string) {
      return this.update(id, { is_verified: true })
    }
  },

  // Leads
  leads: {
    async getAll(filters?: { status?: string; lenderId?: string; limit?: number }) {
      let query = supabase
        .from('leads')
        .select(`
          *,
          lender:lenders(name, slug),
          profile:profiles(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.lenderId) {
        query = query.eq('lender_id', filters.lenderId)
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          lender:lenders(name, slug),
          profile:profiles(first_name, last_name, email),
          activities:lead_activities(*)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async updateStatus(id: string, status: string, performedBy: string, notes?: string) {
      // Update lead status
      const { data: lead, error: updateError } = await supabaseAdmin
        .from('leads')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          ...(notes && { notes })
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Log activity
      await this.logActivity(id, 'status_change', `Status changed to ${status}`, performedBy)

      return lead
    },

    async assignTo(id: string, assignedTo: string, performedBy: string) {
      const { data, error } = await supabaseAdmin
        .from('leads')
        .update({ 
          assigned_to: assignedTo,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Log activity
      await this.logActivity(id, 'assignment_changed', `Lead assigned to new user`, performedBy)

      return data
    },

    async addNote(id: string, note: string, performedBy: string) {
      // Get current notes
      const { data: currentLead } = await supabase
        .from('leads')
        .select('notes')
        .eq('id', id)
        .single()

      const updatedNotes = currentLead?.notes ? `${currentLead.notes}\n\n${note}` : note

      const { data, error } = await supabaseAdmin
        .from('leads')
        .update({ 
          notes: updatedNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Log activity
      await this.logActivity(id, 'note_added', note, performedBy)

      return data
    },

    async logActivity(leadId: string, activityType: string, description: string, performedBy: string, metadata?: any) {
      const { error } = await supabaseAdmin
        .from('lead_activities')
        .insert({
          lead_id: leadId,
          activity_type: activityType,
          description,
          performed_by: performedBy,
          metadata
        })

      if (error) throw error
    },

    async getStatistics() {
      const { data: stats, error } = await supabase
        .from('leads')
        .select('status')

      if (error) throw error

      const statusCounts = stats.reduce((acc: any, lead: any) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
      }, {})

      return {
        total: stats.length,
        by_status: statusCounts
      }
    }
  },

  // Blog Posts
  blogPosts: {
    async getAll(filters?: { status?: string; featured?: boolean; limit?: number }) {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(first_name, last_name),
          categories:blog_post_categories(category:blog_categories(*))
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.featured !== undefined) {
        query = query.eq('is_featured', filters.featured)
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(first_name, last_name),
          categories:blog_post_categories(category:blog_categories(*))
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .insert(post)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<BlogPost>) {
      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async publish(id: string) {
      return this.update(id, { 
        status: 'published', 
        published_at: new Date().toISOString() 
      })
    },

    async unpublish(id: string) {
      return this.update(id, { status: 'draft' })
    },

    async delete(id: string) {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  // Blog Categories
  blogCategories: {
    async getAll() {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data
    },

    async create(category: Omit<BlogCategory, 'id' | 'created_at'>) {
      const { data, error } = await supabaseAdmin
        .from('blog_categories')
        .insert(category)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Analytics
  analytics: {
    async getDashboardStats() {
      const [lenders, leads, blogPosts] = await Promise.all([
        supabase.from('lenders').select('id, is_active'),
        supabase.from('leads').select('id, status, created_at'),
        supabase.from('blog_posts').select('id, status')
      ])

      const activeLenders = lenders.data?.filter(l => l.is_active).length || 0
      const totalLenders = lenders.data?.length || 0

      const leadStats = leads.data?.reduce((acc: any, lead: any) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
      }, {}) || {}

      const publishedPosts = blogPosts.data?.filter(p => p.status === 'published').length || 0
      const draftPosts = blogPosts.data?.filter(p => p.status === 'draft').length || 0

      // Recent leads (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentLeads = leads.data?.filter(
        lead => new Date(lead.created_at) > thirtyDaysAgo
      ).length || 0

      return {
        lenders: {
          total: totalLenders,
          active: activeLenders,
          inactive: totalLenders - activeLenders
        },
        leads: {
          total: leads.data?.length || 0,
          recent: recentLeads,
          by_status: leadStats
        },
        blog: {
          published: publishedPosts,
          drafts: draftPosts,
          total: (publishedPosts + draftPosts)
        }
      }
    }
  }
}

// Type definitions
export interface Lender {
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

export interface Lead {
  id: string
  profile_id?: string
  lender_id?: string
  loan_product_id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  loan_amount: number
  loan_purpose?: string
  employment_status?: string
  monthly_income?: number
  status: 'new' | 'contacted' | 'qualified' | 'approved' | 'rejected' | 'closed'
  source: string
  notes?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  author_id?: string
  title: string
  slug: string
  excerpt?: string
  content: any // JSONB content from rich editor
  featured_image_url?: string
  meta_title?: string
  meta_description?: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  is_active: boolean
  created_at: string
}