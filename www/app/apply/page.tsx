import { LoanApplicationForm } from "@/components/loan-application-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
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
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Help</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Application Form */}
      <main className="py-8">
        <LoanApplicationForm />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-slate-400">
              Need help with your application? Contact our support team at{" "}
              <a href="mailto:support@financing.ph" className="text-orange-400 hover:underline">
                support@financing.ph
              </a>{" "}
              or call{" "}
              <a href="tel:+63123456789" className="text-orange-400 hover:underline">
                +63 123 456 789
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
