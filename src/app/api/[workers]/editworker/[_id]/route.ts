import dbConnection from "@/lib/dbConnection";
import { WorkerModel } from "@/models/worker.model";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: { _id: string } }
) {
  dbConnection();
  const { _id } = context.params;
  //console.log("id",_id)
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
    const updatedWorker = await WorkerModel.findByIdAndUpdate(_id,{
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
    return Response.json(
        {
            success: true,
            message: "Worker Updated Successfully",
        },
        {
            status: 200,
        }
    ) 
  } catch (error) {
    console.log("Error in updating worker", error);
    return Response.json(
        {
            success:false,
            message:"Error in updating worker"
        },
        {
            status:500
        }
    )
  }
}
