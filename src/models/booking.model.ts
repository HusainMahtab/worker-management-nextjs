import mongoose, { Schema } from "mongoose";

interface Booking {
  bookingFrom: string; // user email who is booking
  bookingTo: string; // worker email being booked
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  bookingType: "daily" | "monthly";
  status: "pending" | "accepted" | "rejected" | "completed";
  workerName: string;
  userName: string;
}

const bookingSchema: Schema<Booking> = new mongoose.Schema({
  bookingFrom: {
    type: String,
    required: [true, "Booking from is required"]
  },
  bookingTo: {
    type: String,
    required: [true, "Booking to is required"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"]
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"]
  },
  bookingType: {
    type: String,
    enum: ["daily", "monthly"],
    required: [true, "Booking type is required"]
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending"
  },
  workerName: {
    type: String,
    required: [true, "Worker name is required"]
  },
  userName: {
    type: String,
    required: [true, "User name is required"]
  }
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model<Booking>("Booking", bookingSchema); 