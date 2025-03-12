import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IoMdStar } from "react-icons/io";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import axios from 'axios';

interface RatingReviewProps {
  workerId: string;
  onReviewAdded: () => void;
}

export function RatingReview({ workerId, onReviewAdded }: RatingReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {data:session} = useSession();
  const currentUser = session?.user.username;
  
  const handleSubmit = async () => {
    if (!currentUser) {
      toast({
        title: "Please login to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post('/api/workers/rate-review', {
        workerId,
        rating,
        review,
        reviewedBy: currentUser
      });

      toast({
        title: "Review submitted successfully",
      });

      setRating(0);
      setReview('');
      onReviewAdded();
      
    } catch (error) {
      toast({
        title: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rate & Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate and Review</DialogTitle>
          <DialogDescription>
            Share your experience with this worker. Your feedback helps others make better decisions.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-3xl focus:outline-none transition-colors duration-200"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <IoMdStar
                  className={`${
                    (hoverRating || rating) >= star
                      ? "text-yellow-500"
                      : "text-gray-700"
                  } hover:scale-110 transition-transform duration-200`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 