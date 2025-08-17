import { Pool } from 'pg'

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase.co') ? { rejectUnauthorized: false } : false
})

export const db = {
  // Lenders
  lenders: {
    async getAll() {
      const result = await pool.query(`
        SELECT * FROM lenders 
        ORDER BY created_at DESC
      `)
      return result.rows
    },

    async getById(id: string) {
      const result = await pool.query(`
        SELECT * FROM lenders WHERE id = $1
      `, [id])
      return result.rows[0]
    },

    async create(lender: any) {
      const {
        name, slug, description, logo_url, website_url, phone, email, address,
        rating = 0, review_count = 0, is_verified = false, is_active = true,
        minimum_loan_amount, maximum_loan_amount, minimum_interest_rate,
        maximum_interest_rate, processing_time_days, requirements = []
      } = lender

      const result = await pool.query(`
        INSERT INTO lenders (
          name, slug, description, logo_url, website_url, phone, email, address,
          rating, review_count, is_verified, is_active, minimum_loan_amount,
          maximum_loan_amount, minimum_interest_rate, maximum_interest_rate,
          processing_time_days, requirements
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `, [
        name, slug, description, logo_url, website_url, phone, email, address,
        rating, review_count, is_verified, is_active, minimum_loan_amount,
        maximum_loan_amount, minimum_interest_rate, maximum_interest_rate,
        processing_time_days, requirements
      ])
      return result.rows[0]
    },

    async update(id: string, updates: any) {
      const fields = Object.keys(updates).filter(key => key !== 'id')
      const values = fields.map(field => updates[field])
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')

      const result = await pool.query(`
        UPDATE lenders 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, ...values])
      return result.rows[0]
    },

    async delete(id: string) {
      await pool.query('DELETE FROM lenders WHERE id = $1', [id])
    },

    async verify(id: string) {
      const result = await pool.query(`
        UPDATE lenders 
        SET is_verified = true, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id])
      return result.rows[0]
    },

    async toggleStatus(id: string, isActive: boolean) {
      const result = await pool.query(`
        UPDATE lenders 
        SET is_active = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, isActive])
      return result.rows[0]
    }
  },

  // Leads
  leads: {
    async getAll(filters?: { status?: string; lenderId?: string; limit?: number }) {
      let query = `
        SELECT l.*, 
               lenders.name as lender_name, lenders.slug as lender_slug,
               profiles.first_name, profiles.last_name, profiles.email as profile_email
        FROM leads l
        LEFT JOIN lenders ON l.lender_id = lenders.id
        LEFT JOIN profiles ON l.profile_id = profiles.id
        WHERE 1=1
      `
      const params: any[] = []
      let paramIndex = 1

      if (filters?.status) {
        query += ` AND l.status = $${paramIndex}`
        params.push(filters.status)
        paramIndex++
      }

      if (filters?.lenderId) {
        query += ` AND l.lender_id = $${paramIndex}`
        params.push(filters.lenderId)
        paramIndex++
      }

      query += ' ORDER BY l.created_at DESC'

      if (filters?.limit) {
        query += ` LIMIT $${paramIndex}`
        params.push(filters.limit)
      }

      const result = await pool.query(query, params)
      return result.rows
    },

    async getById(id: string) {
      const result = await pool.query(`
        SELECT l.*, 
               lenders.name as lender_name, lenders.slug as lender_slug,
               profiles.first_name, profiles.last_name, profiles.email as profile_email
        FROM leads l
        LEFT JOIN lenders ON l.lender_id = lenders.id
        LEFT JOIN profiles ON l.profile_id = profiles.id
        WHERE l.id = $1
      `, [id])
      return result.rows[0]
    },

    async create(lead: any) {
      const {
        first_name, last_name, email, phone, loan_amount, loan_purpose,
        employment_status, monthly_income, lender_id, source = 'website',
        status = 'new'
      } = lead

      const result = await pool.query(`
        INSERT INTO leads (
          first_name, last_name, email, phone, loan_amount, loan_purpose,
          employment_status, monthly_income, lender_id, source, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        first_name, last_name, email, phone, loan_amount, loan_purpose,
        employment_status, monthly_income, lender_id, source, status
      ])
      return result.rows[0]
    },

    async updateStatus(id: string, status: string, userId: string, notes?: string) {
      const result = await pool.query(`
        UPDATE leads 
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, status])
      
      // Add note if provided
      if (notes) {
        await this.addNote(id, notes, userId)
      }
      
      return result.rows[0]
    },

    async assignTo(id: string, assignedTo: string, userId: string) {
      const result = await pool.query(`
        UPDATE leads 
        SET assigned_to = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, assignedTo])
      return result.rows[0]
    },

    async addNote(id: string, note: string, userId: string) {
      // For now, we'll store notes in a simple way
      // In production, you might want a separate notes table
      const result = await pool.query(`
        UPDATE leads 
        SET notes = COALESCE(notes || E'\n\n', '') || $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [id, `[${new Date().toISOString()}] ${note}`])
      return result.rows[0]
    },

    async getStatistics() {
      const result = await pool.query('SELECT status FROM leads')
      const statusCounts = result.rows.reduce((acc: any, lead: any) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
      }, {})

      return {
        total: result.rows.length,
        by_status: statusCounts
      }
    }
  },

  // Analytics
  analytics: {
    async getDashboardStats() {
      const [lenders, leads, blogPosts] = await Promise.all([
        pool.query('SELECT id, is_active FROM lenders'),
        pool.query('SELECT id, status, created_at FROM leads'),
        pool.query('SELECT id, status FROM blog_posts')
      ])

      const activeLenders = lenders.rows.filter(l => l.is_active).length
      const totalLenders = lenders.rows.length

      const leadStats = leads.rows.reduce((acc: any, lead: any) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
      }, {})

      const publishedPosts = blogPosts.rows.filter(p => p.status === 'published').length
      const draftPosts = blogPosts.rows.filter(p => p.status === 'draft').length

      // Recent leads (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentLeads = leads.rows.filter(
        lead => new Date(lead.created_at) > thirtyDaysAgo
      ).length

      return {
        lenders: {
          total: totalLenders,
          active: activeLenders,
          inactive: totalLenders - activeLenders
        },
        leads: {
          total: leads.rows.length,
          recent: recentLeads,
          by_status: leadStats
        },
        blog: {
          published: publishedPosts,
          drafts: draftPosts,
          total: publishedPosts + draftPosts
        }
      }
    }
  }
}