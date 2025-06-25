import { Star } from 'lucide-react'
import { ReviewCard } from './review-card'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  gig: {
    title: string
    images: string[]
  }
  reviewer: {
    name: string | null
    image: string | null
  }
}

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
} 