import dbConnection from "@/lib/dbConnection";
import { WorkerModel } from "@/models/worker.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
) {
  dbConnection();
  
  // Get the _id from the URL using request.url
  const url = new URL(request.url);
  const _id = url.pathname.split('/').pop();

  const {
    workerName,
    workerEmail,
    workerPhoneNumber,
    workerExperties,
    workerProfileBio,
    workerChargePerDay,
    workerChargePerMonth,
    workerLocation,
    isWorkerAvailable
  } = await request.json();

  // console.log("workerName",workerName,workerEmail,
  //   workerPhoneNumber,
  //   workerExperties,
  //   workerProfileBio,
  //   workerChargePerDay,)
 
  try {
    const updatedWorker = await WorkerModel.findByIdAndUpdate(_id, {
        workerName,
        workerEmail,
        workerPhoneNumber,
        workerExperties,
        workerProfileBio,
        workerChargePerDay,
        workerChargePerMonth,
        workerLocation,
        isWorkerAvailable
    }, {
      new: true,
    });

    if (!updatedWorker) {
      return NextResponse.json(
        {
          success: false,
          message: "Worker not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Worker Updated Successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in updating worker", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in updating worker"
      },
      {
        status: 500
      }
    );
  }
}
