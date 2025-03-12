import dbConnection from "@/lib/dbConnection";
import { WorkerModel } from "@/models/worker.model";

export async function POST(request:Request){
    dbConnection()
    const {workerEmail,workerVerifiedCode}=await request.json()
    try {
        const worker=await WorkerModel.findOne({workerEmail})
        if(worker){
            if(worker.isWorkerVerified){
                return Response.json(
                    {
                        success:false,
                        message:"worker already verified"
                    },
                    {
                        status:400
                    }
                )
            }else{
                const isCodeValid=worker.workerVerifiedCode===workerVerifiedCode
                const isCodeNotExpired=worker.workerVerifiedCodeExpiry > new Date(Date.now())
                if(isCodeValid && isCodeNotExpired){
                    worker.isWorkerVerified=true
                }
                await worker.save()
            }
        }
        return Response.json(
            {
                success:true,
                message:"worker verified successfully"
            },
            {
                status:201
            }
        )
    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"Error worker verification "
            },
            {
                status:500
            }
        )
    }
}