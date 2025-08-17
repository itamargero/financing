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
        WHERE is_active = true
        ORDER BY rating DESC, review_count DESC
      `)
      return result.rows
    },

    async getBySlug(slug: string) {
      const result = await pool.query(`
        SELECT * FROM lenders WHERE slug = $1 AND is_active = true
      `, [slug])
      return result.rows[0]
    }
  },

  // Leads (for form submissions)
  leads: {
    async create(lead: any) {
      const {
        first_name, last_name, email, phone, loan_amount, loan_purpose,
        employment_status, monthly_income, lender_id, source = 'website'
      } = lead

      const result = await pool.query(`
        INSERT INTO leads (
          first_name, last_name, email, phone, loan_amount, loan_purpose,
          employment_status, monthly_income, lender_id, source, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'new')
        RETURNING *
      `, [
        first_name, last_name, email, phone, loan_amount, loan_purpose,
        employment_status, monthly_income, lender_id, source
      ])
      return result.rows[0]
    }
  }
}