import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Link from "next/link"

interface LenderCardProps {
  name: string
  logo: string
  rating: number
  reviewCount: number
  minAmount: number
  maxAmount: number
  interestRate: string
  processingTime: string
  loanType: string
  slug?: string
}

export function LenderCard({
  name,
  logo,
  rating,
  reviewCount,
  minAmount,
  maxAmount,
  interestRate,
  processingTime,
  loanType,
  slug,
}: LenderCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Create slug from name
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="font-bold text-slate-700 text-lg">{name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-sm text-slate-500">({reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-slate-600">Loan Range</span>
            <span className="font-medium">
              {formatCurrency(minAmount)} - {formatCurrency(maxAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Interest Rate</span>
            <span className="font-medium">{interestRate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Processing Time</span>
            <span className="font-medium">{processingTime}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">{loanType}</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/lender/${slug || createSlug(name)}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>
          <Link href="/apply" className="flex-1">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Apply</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
