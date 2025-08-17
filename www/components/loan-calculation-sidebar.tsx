"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Lender {
  id: string
  name: string
  fullName: string
  minAmount: number
  maxAmount: number
  interestRate: string
  maxAPR: number
  processingFee: number
  approvalTime: string
}

interface LoanCalculationSidebarProps {
  lender: Lender
  selectedAmount: number
  selectedTerm: number
}

export function LoanCalculationSidebar({ lender, selectedAmount, selectedTerm }: LoanCalculationSidebarProps) {
  // Calculate loan details
  const interestRate = 0.035 // 3.5% monthly (this should be dynamic based on lender)
  const monthlyPayment = selectedAmount * (1 + interestRate)
  const totalRepayment = monthlyPayment * selectedTerm

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="sticky top-24 space-y-4">
      {/* Loan Details Card */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-slate-700">{lender.name.charAt(0)}</span>
              </div>
              <span className="font-semibold text-slate-700">{lender.name}</span>
            </div>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
              Business Loan
            </span>
          </div>

          <h3 className="text-xl font-semibold text-slate-800 mb-2">{lender.fullName}</h3>

          <p className="text-sm text-slate-600 mb-4">
            This will be the estimated monthly amortization{" "}
            <span className="text-red-500 font-medium">excluding fees and charges</span>
          </p>

          <div className="text-3xl font-bold text-slate-800 mb-6">{formatCurrency(monthlyPayment)}/month</div>

          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-slate-600">Loan Amount</span>
              <span className="font-semibold">{formatCurrency(selectedAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Term</span>
              <span className="font-semibold">
                {selectedTerm} Month{selectedTerm > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Approval Time</span>
              <span className="font-semibold">{lender.approvalTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Interest Monthly</span>
              <span className="font-semibold">{(interestRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Maximum APR</span>
              <span className="font-semibold">{lender.maxAPR}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">One-time Processing Fee</span>
              <span className="font-semibold">{lender.processingFee}%</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-slate-600">Total Repayment</span>
              <span className="font-semibold">{formatCurrency(totalRepayment)}</span>
            </div>
          </div>

          <Link href="/apply">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-3">Log in to Apply</Button>
          </Link>

          <p className="text-center text-sm text-slate-600">
            Don't have an account yet?{" "}
            <a href="#" className="text-orange-500 font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Contact Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
          <p className="text-sm text-blue-700 mb-3">Have questions about this loan? Our experts are here to help.</p>
          <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
