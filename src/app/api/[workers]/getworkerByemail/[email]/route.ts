import dbConnection from "@/lib/dbConnection";
import { WorkerModel } from "@/models/worker.model";

export  async function GET(request:Request,{params}:{params:{email:string}}){
  await dbConnection();
  const { email } = await params;
  //console.log("email", email);
  if(!email){
    return Response.json(
        {
            success:false,
            message:"Email is required"
        },
        {
            status:400
        }
    )
  }
  try {
    const worker=await WorkerModel.findOne({workerEmail:email});
    //console.log("worker", worker);
   return Response.json(
    {
        success:true,
        message:"worker fetched successfully",
        worker
    },
    {
        status:200
    }
   )
  } catch (error) {
    console.error("error while fetching worker by email", error);
    return Response.json(
        {
            success:false,
            message:"error while fetching worker by email"
        },
        {
            status:500
        }
    )
  }
}