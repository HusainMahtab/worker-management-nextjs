import React from 'react';
import { IoMdStar } from "react-icons/io";

interface Review {
  rating: number;
  comment: string;
  reviewedBy: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <IoMdStar
                        key={i}
                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.reviewedBy}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 