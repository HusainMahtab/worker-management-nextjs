import { WorkerModel } from "@/models/worker.model";
import dbConnection from "@/lib/dbConnection";

export async function GET(request:Request){
   dbConnection()
   try {
    const workers=await WorkerModel.find()
    if(!workers){
        return Response.json(
            {
                success:false,
                message:"workers not found!"
            },
            {
                status:404
            }
        )
    }
    return Response.json(
        {
            success:true,
            workers,
            message:"workers fetched successfully"
        },
        {
            status:201
        }
    )
   } catch (error) {
      return Response.json(
        {
            success:false,
            message:"Error during fetching workers"
        },
        {
            status:500
        }
      )
   }
}