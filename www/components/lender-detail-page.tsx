"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Star, MapPin, Clock, Percent, FileText, CheckCircle, Users, Shield } from "lucide-react"
import { LoanCalculationSidebar } from "@/components/loan-calculation-sidebar"
import { LenderReviews } from "@/components/lender-reviews"

interface Lender {
  id: string
  name: string
  fullName: string
  logo: string
  rating: number
  reviewCount: number
  minAmount: number
  maxAmount: number
  interestRate: string
  processingTime: string
  loanType: string
  maxAPR: number
  processingFee: number
  approvalTime: string
  description: string
  features: string[]
  requirements: string[]
  eligibility: string[]
  locations: string[]
}

interface LenderDetailPageProps {
  lender: Lender
}

export function LenderDetailPage({ lender }: LenderDetailPageProps) {
  const [selectedAmount, setSelectedAmount] = useState(500000)
  const [selectedTerm, setSelectedTerm] = useState(1)

  const terms = [1, 3, 6, 9]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Lender Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-slate-700 text-2xl">{lender.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-slate-800">{lender.name}</h1>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-600">
                      {lender.loanType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{lender.rating}</span>
                      <span className="text-slate-500">({lender.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{lender.processingTime} processing</span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{lender.description}</p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{formatCurrency(lender.minAmount)}</div>
                  <div className="text-sm text-slate-600">Minimum Loan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{formatCurrency(lender.maxAmount)}</div>
                  <div className="text-sm text-slate-600">Maximum Loan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{lender.interestRate}</div>
                  <div className="text-sm text-slate-600">Interest Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{lender.approvalTime}</div>
                  <div className="text-sm text-slate-600">Approval Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Calculator Section */}
          <Card className="bg-slate-800 text-white border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">How much do you want to borrow?</h2>

              <div className="text-4xl font-bold text-white mb-4">{formatCurrency(selectedAmount)}</div>

              <Slider
                value={[selectedAmount]}
                onValueChange={(value) => setSelectedAmount(value[0])}
                max={lender.maxAmount}
                min={lender.minAmount}
                step={50000}
                className="mb-4"
              />

              <div className="flex justify-between text-sm text-slate-300 mb-6">
                <span>Minimum: {formatCurrency(lender.minAmount)}</span>
                <span>Maximum: {formatCurrency(lender.maxAmount)}</span>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">Choose a loan term for this</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {lender.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-blue-500" />
                    Loan Terms & Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Interest Rate</span>
                        <span className="font-medium">{lender.interestRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Maximum APR</span>
                        <span className="font-medium">{lender.maxAPR}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Processing Fee</span>
                        <span className="font-medium">{lender.processingFee}%</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Loan Range</span>
                        <span className="font-medium">
                          {formatCurrency(lender.minAmount)} - {formatCurrency(lender.maxAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Processing Time</span>
                        <span className="font-medium">{lender.processingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Approval Time</span>
                        <span className="font-medium">{lender.approvalTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {lender.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> All documents must be clear, readable copies. Original documents may be
                      required for verification during the approval process.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eligibility">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {lender.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 text-sm">
                      <strong>Pre-qualification:</strong> Meeting these criteria doesn't guarantee loan approval. Final
                      approval is subject to credit assessment and verification of submitted documents.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Service Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {lender.locations.map((location, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-slate-700">{location}</span>
                      </div>
                    ))}
                  </div>
                  {lender.locations.length === 1 && lender.locations[0] === "Nationwide coverage available" && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 text-sm">
                        <strong>Nationwide Service:</strong> This lender provides services across all provinces in the
                        Philippines. Remote application and processing available.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <LenderReviews
                lenderId={lender.id}
                lenderName={lender.name}
                overallRating={lender.rating}
                totalReviews={lender.reviewCount}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Sidebar - Only Calculation Card */}
        <div className="lg:col-span-1">
          <LoanCalculationSidebar lender={lender} selectedAmount={selectedAmount} selectedTerm={selectedTerm} />
        </div>
      </div>
    </div>
  )
}
