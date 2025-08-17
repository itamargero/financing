import { LoanCalculator } from "@/components/loan-calculator"
import { LenderCard } from "@/components/lender-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { db } from "@/lib/db"

async function getLenders() {
  try {
    return await db.lenders.getAll()
  } catch (error) {
    console.error('Error fetching lenders:', error)
    return []
  }
}

export default async function HomePage() {
  const lenders = await getLenders()
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">Financing.ph</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="hover:text-orange-400 transition-colors">
                About Us
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                Products
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                Partners
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                Blog
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                FAQs
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
                Log in
              </Button>
              <Link href="/apply">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Calculator */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-16">
        <div className="container mx-auto px-4">
          <LoanCalculator showDetails={false} className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Lenders Directory */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Trusted Lending Partners</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Compare and choose from our network of verified lenders to find the best loan option for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lenders.map((lender, index) => (
              <LenderCard 
                key={lender.id} 
                name={lender.name}
                logo={lender.logo_url || "/placeholder.svg?height=48&width=48"}
                rating={parseFloat(lender.rating) || 0}
                reviewCount={lender.review_count || 0}
                minAmount={parseFloat(lender.minimum_loan_amount) || 0}
                maxAmount={parseFloat(lender.maximum_loan_amount) || 0}
                interestRate={`${lender.minimum_interest_rate || 0}% monthly`}
                processingTime={`${lender.processing_time_days || 0} days`}
                loanType={lender.minimum_loan_amount >= 200000 ? "Business Loan" : "Personal Loan"}
                slug={lender.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
