import { LoanCalculator } from "@/components/loan-calculator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

const locations = [
  "Aurora",
  "Nueva Ecija",
  "Bataan",
  "Pampanga",
  "Batangas",
  "Quezon",
  "Bulacan",
  "Rizal",
  "Cavite",
  "Tarlac",
  "Laguna",
  "Zambales",
  "METRO MANILA",
]

export default function CalculatorPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold">Financing.ph</span>
              </div>
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
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Apply Now</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Calculator Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-16">
        <div className="container mx-auto px-4">
          <LoanCalculator className="max-w-6xl mx-auto" />
        </div>
      </section>

      {/* Location Restrictions */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Limited to businesses in the following locations:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {locations.map((location, index) => (
                    <div key={index} className="text-sm text-blue-700">
                      • {location}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg text-slate-700 mb-4">Business Documents</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Business Registration Certificate</li>
                <li>• Mayor's Permit</li>
                <li>• BIR Certificate of Registration</li>
                <li>• Financial Statements (Latest 2 years)</li>
                <li>• Bank Statements (Latest 6 months)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-700 mb-4">Personal Documents</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Valid Government ID</li>
                <li>• Proof of Income</li>
                <li>• Proof of Billing Address</li>
                <li>• Co-maker Documents (if applicable)</li>
                <li>• Collateral Documents (if applicable)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
