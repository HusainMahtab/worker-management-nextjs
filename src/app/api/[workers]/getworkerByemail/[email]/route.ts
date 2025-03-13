import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnection";
import { WorkerModel } from "@/models/worker.model";

export async function GET(request: NextRequest) {
  await dbConnection();
  
  // Get the email from the URL using request.url
  const url = new URL(request.url);
  const email = url.pathname.split('/').pop();

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        message: "Email is required"
      },
      {
        status: 400
      }
    );
  }

  try {
    const worker = await WorkerModel.findOne({ workerEmail: email });
    return NextResponse.json(
      {
        success: true,
        message: "worker fetched successfully",
        worker
      },
      {
        status: 200
      }
    );
  } catch (error) {
    console.error("error while fetching worker by email", error);
    return NextResponse.json(
      {
        success: false,
        message: "error while fetching worker by email"
      },
      {
        status: 500
      }
    );
  }
}