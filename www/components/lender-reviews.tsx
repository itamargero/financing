"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, ThumbsDown, User, Calendar } from "lucide-react"

interface Review {
  id: string
  userName: string
  rating: number
  title: string
  comment: string
  date: string
  loanAmount: number
  loanType: string
  verified: boolean
  helpful: number
  notHelpful: number
}

interface LenderReviewsProps {
  lenderId: string
  lenderName: string
  overallRating: number
  totalReviews: number
}

// Mock reviews data - in a real app, this would come from a database
const mockReviews: Record<string, Review[]> = {
  "alon-capital": [
    {
      id: "1",
      userName: "Maria Santos",
      rating: 5,
      title: "Excellent service and fast approval",
      comment:
        "Applied for a business loan and got approved within 3 days. The process was smooth and the staff was very helpful. Highly recommended for business owners looking for quick financing.",
      date: "2024-01-15",
      loanAmount: 800000,
      loanType: "Business Loan",
      verified: true,
      helpful: 12,
      notHelpful: 1,
    },
    {
      id: "2",
      userName: "Juan Dela Cruz",
      rating: 4,
      title: "Good rates but documentation is extensive",
      comment:
        "The interest rates are competitive, but they require a lot of documents. Overall satisfied with the loan terms and customer service.",
      date: "2024-01-10",
      loanAmount: 1200000,
      loanType: "Business Loan",
      verified: true,
      helpful: 8,
      notHelpful: 2,
    },
    {
      id: "3",
      userName: "Anna Reyes",
      rating: 5,
      title: "Professional and reliable",
      comment:
        "Very professional team. They explained everything clearly and helped me understand all the terms. The approval was quick and the funds were released on time.",
      date: "2024-01-05",
      loanAmount: 600000,
      loanType: "Business Loan",
      verified: false,
      helpful: 15,
      notHelpful: 0,
    },
  ],
  "fasttrack-finance": [
    {
      id: "4",
      userName: "Robert Garcia",
      rating: 5,
      title: "True to their name - very fast!",
      comment:
        "Needed emergency funds and they delivered. Applied online and got approved the same day. Funds were in my account within 24 hours. Amazing service!",
      date: "2024-01-12",
      loanAmount: 300000,
      loanType: "Personal Loan",
      verified: true,
      helpful: 20,
      notHelpful: 1,
    },
    {
      id: "5",
      userName: "Lisa Mendoza",
      rating: 4,
      title: "Fast approval, reasonable rates",
      comment:
        "The application process was straightforward and approval was indeed fast. Interest rates are reasonable for personal loans. Good experience overall.",
      date: "2024-01-08",
      loanAmount: 150000,
      loanType: "Personal Loan",
      verified: true,
      helpful: 7,
      notHelpful: 0,
    },
  ],
}

export function LenderReviews({ lenderId, lenderName, overallRating, totalReviews }: LenderReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    userName: "",
    loanAmount: "",
    loanType: "",
  })

  const reviews = mockReviews[lenderId] || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    console.log("Submitting review:", newReview)
    setShowReviewForm(false)
    setNewReview({
      rating: 0,
      title: "",
      comment: "",
      userName: "",
      loanAmount: "",
      loanType: "",
    })
    // Show success message
    alert("Thank you for your review! It will be published after verification.")
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : interactive
                  ? "text-gray-300 hover:text-yellow-400 cursor-pointer"
                  : "text-gray-300"
            }`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">{overallRating}</div>
              <div className="flex justify-center mb-2">{renderStars(overallRating)}</div>
              <p className="text-slate-600">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-sm text-slate-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button onClick={() => setShowReviewForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
              Write a Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review for {lenderName}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userName">Your Name *</Label>
                  <Input
                    id="userName"
                    value={newReview.userName}
                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loanAmount">Loan Amount (₱)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={newReview.loanAmount}
                    onChange={(e) => setNewReview({ ...newReview, loanAmount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Overall Rating *</Label>
                  <div className="mt-2">
                    {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Input
                    id="loanType"
                    value={newReview.loanType}
                    onChange={(e) => setNewReview({ ...newReview, loanType: e.target.value })}
                    placeholder="e.g., Business Loan, Personal Loan"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Review Title *</Label>
                <Input
                  id="title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              <div>
                <Label htmlFor="comment">Your Review *</Label>
                <Textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this lender..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Submit Review
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-600 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <div className="text-sm text-slate-600 mt-1">
                    {formatCurrency(review.loanAmount)} • {review.loanType}
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-slate-800 mb-2">{review.title}</h4>
              <p className="text-slate-700 mb-4 leading-relaxed">{review.comment}</p>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>Was this review helpful?</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {review.helpful}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    {review.notHelpful}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No reviews yet</h3>
              <p className="text-slate-500 mb-4">Be the first to share your experience with {lenderName}</p>
              <Button onClick={() => setShowReviewForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                Write the First Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
