"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface LoanCalculatorProps {
  showDetails?: boolean
  className?: string
}

export function LoanCalculator({ showDetails = true, className = "" }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState([500000])
  const [selectedTerm, setSelectedTerm] = useState(1)

  const minAmount = 500000
  const maxAmount = 3000000
  const terms = [1, 3, 6, 9]

  // Calculate loan details
  const interestRate = 0.035 // 3.5% monthly
  const processingFee = 0.06 // 6%
  const monthlyPayment = loanAmount[0] * (1 + interestRate)
  const totalRepayment = monthlyPayment * selectedTerm
  const maxAPR = 42

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className={`grid gap-6 ${showDetails ? "lg:grid-cols-2" : ""} ${className}`}>
      {/* Calculator Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">How much do you want to borrow?</h2>

          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-white mb-4">{formatCurrency(loanAmount[0])}</div>

              <Slider
                value={loanAmount}
                onValueChange={setLoanAmount}
                max={maxAmount}
                min={minAmount}
                step={50000}
                className="mb-4"
              />

              <div className="flex justify-between text-sm text-slate-300">
                <span>Minimum Loan Amount: {formatCurrency(minAmount)}</span>
                <span>Maximum Loan Amount: {formatCurrency(maxAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Choose a loan term for this</h3>

          <div className="flex gap-3 flex-wrap">
            {terms.map((term) => (
              <Button
                key={term}
                variant={selectedTerm === term ? "default" : "outline"}
                onClick={() => setSelectedTerm(term)}
                className={`${
                  selectedTerm === term
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                }`}
              >
                {term} Month{term > 1 ? "s" : ""}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Loan Details Card */}
      {showDetails && (
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-slate-700">A</span>
                </div>
                <span className="font-semibold text-slate-700">Alon</span>
              </div>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                Business Loan
              </span>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-2">Alon Capital Business Loan</h3>

            <p className="text-sm text-slate-600 mb-4">
              This will be the estimated monthly amortization{" "}
              <span className="text-red-500 font-medium">excluding fees and charges</span>
            </p>

            <div className="text-3xl font-bold text-slate-800 mb-6">{formatCurrency(monthlyPayment)}/month</div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Loan Amount</span>
                <span className="font-semibold">{formatCurrency(loanAmount[0])}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Term</span>
                <span className="font-semibold">
                  {selectedTerm} Month{selectedTerm > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Approval Time</span>
                <span className="font-semibold">5 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Interest Monthly</span>
                <span className="font-semibold">{(interestRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Maximum APR</span>
                <span className="font-semibold">{maxAPR}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">One-time Processing Fee</span>
                <span className="font-semibold">{processingFee * 100}%</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-slate-600">Total Repayment</span>
                <span className="font-semibold">{formatCurrency(totalRepayment)}</span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white">Log in to Apply</Button>

            <p className="text-center text-sm text-slate-600 mt-3">
              Don't have an account yet?{" "}
              <a href="#" className="text-orange-500 font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
