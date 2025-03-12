import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnection";
import { WorkerModel } from "@/models/worker.model";

export async function POST(request: NextRequest) {
    dbConnection()
  try {
    const reqBody = await request.json();
    const { workerId, rating, review, reviewedBy } = reqBody;

    // Find the worker and update their ratings and reviews
    const worker = await WorkerModel.findById(workerId);
    
    if (!worker) {
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      );
    }

    // Calculate new average rating
    const currentRating = worker.ratings || 0;
    const currentReviewCount = worker.reviews?.length || 0;
    const newRating = (currentRating * currentReviewCount + rating) / (currentReviewCount + 1);

    // Add the new review
    const newReview = {
      rating,
      comment: review,
      reviewedBy,
      createdAt: new Date()
    };

    // Update worker with new rating and review
    const updatedWorker = await WorkerModel.findByIdAndUpdate(
      workerId,
      {
        $push: { reviews: newReview },
        $set: { ratings: Number(newRating.toFixed(1)) }
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Rating and review added successfully",
      worker: updatedWorker
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workerId = url.searchParams.get("workerId");

    if (!workerId) {
      return NextResponse.json(
        { error: "Worker ID is required" },
        { status: 400 }
      );
    }

    const worker = await WorkerModel.findById(workerId);
    
    if (!worker) {
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ratings: worker.ratings,
      reviews: worker.reviews
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 