import { NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnection";
import { Booking } from "@/models/booking.model";

export async function POST(request: Request) {
  try {
    await dbConnection();
    const {
      bookingFrom,
      bookingTo,
      startDate,
      endDate,
      totalAmount,
      bookingType,
      workerName,
      userName
    } = await request.json();
    console.log(bookingFrom, bookingTo, startDate, endDate, totalAmount, bookingType, workerName, userName);

    // Validate required fields
    if (!bookingFrom || !bookingTo || !startDate || !endDate || !totalAmount || !bookingType || !workerName || !userName) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required"
        },
        { status: 400 }
      );
    }

    // Create new booking
    const newBooking = new Booking({
      bookingFrom,
      bookingTo,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalAmount,
      bookingType,
      workerName,
      userName,
      status: "pending"
    });

    await newBooking.save();

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking: newBooking
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error in booking creation:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error during booking creation"
      },
      { status: 500 }
    );
  }
} 