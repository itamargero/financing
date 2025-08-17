import { LenderDetailPage } from "@/components/lender-detail-page"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function getLenderBySlug(slug: string) {
  try {
    return await db.lenders.getBySlug(slug)
  } catch (error) {
    console.error('Error fetching lender:', error)
    return null
  }
}

export default async function LenderPage({ params }: PageProps) {
  const { slug } = await params
  const lender = await getLenderBySlug(slug)

  if (!lender) {
    notFound()
  }

  // Transform database data to match LenderDetailPage component expectations
  const lenderData = {
    id: lender.slug,
    name: lender.name,
    fullName: lender.name,
    logo: lender.logo_url || "/placeholder.svg?height=48&width=48",
    rating: parseFloat(lender.rating) || 0,
    reviewCount: lender.review_count || 0,
    minAmount: parseFloat(lender.minimum_loan_amount) || 0,
    maxAmount: parseFloat(lender.maximum_loan_amount) || 0,
    interestRate: `${lender.minimum_interest_rate || 0}% monthly`,
    processingTime: `${lender.processing_time_days || 0} days`,
    loanType: lender.minimum_loan_amount >= 200000 ? "Business Loan" : "Personal Loan",
    maxAPR: parseFloat(lender.maximum_interest_rate) * 12 || 24, // Convert monthly to annual
    processingFee: 2.5, // Default processing fee percentage
    approvalTime: `${lender.processing_time_days || 0} Days`,
    description: lender.description || `${lender.name} provides flexible loan solutions designed to help you achieve your financial goals. With competitive rates and fast approval times, we're committed to supporting your financial success.`,
    features: Array.isArray(lender.requirements) ? lender.requirements : [
      "Competitive interest rates",
      "Flexible repayment terms", 
      "Quick online application process",
      "Professional customer service",
      "Fast approval for qualified applicants"
    ],
    requirements: Array.isArray(lender.requirements) ? lender.requirements : [
      "Valid ID (Driver's License, Passport, or National ID)",
      "Proof of Income (Payslips, ITR, or Certificate of Employment)",
      "Bank statements for the last 3 months",
      "Utility bills for address verification"
    ],
    eligibility: Array.isArray(lender.requirements) ? lender.requirements : [
      "Valid government-issued ID",
      "Proof of income or employment",
      "Bank statements (last 3 months)",
      "Good credit standing"
    ],
    locations: [lender.address || "Metro Manila"]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">Financing.ph</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Home
              </Link>
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

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Lenders
        </Link>
      </div>

      {/* Lender Detail Component */}
      <LenderDetailPage lender={lenderData} />
    </div>
  )
}