import { WorkerModel } from "@/models/worker.model";
import dbConnection from "@/lib/dbConnection";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs";
export async function POST(request:Request) {
    dbConnection()
    const {
    workerName,
    workerEmail,
    workerPhoneNumber,
    workerExperties,
    workerProfileBio,
    isWorkerAvailable,
    workerChargePerDay,
    workerChargePerMonth,
    workerLocation,
}=await request.json()
const verifyCode=Math.round(Math.random()*1000000).toString()  
const codeExpiryDate=new Date()
 try {
    const isWorkerAlreadyExist=await WorkerModel.findOne({workerEmail})
    if(isWorkerAlreadyExist){
        return Response.json(
            {
                success:false,
                message:"worker already exist"
            },
            {
                status:400
            }
        )
    }
    const worker=new WorkerModel({
        workerName,
        workerEmail,
        workerPhoneNumber,
        workerExperties,
        workerProfileBio,
        isWorkerAvailable,
        workerChargePerDay,
        workerChargePerMonth,
        workerLocation,
        workerVerifiedCode:verifyCode,
        workerVerifiedCodeExpiry:codeExpiryDate
    })

    await worker.save()
    return Response.json(
        {
            success:true,
            message:"worker created successfully"
        },
        {
            status:200
        }
    )
    
 } catch (error) {
    console.error("Error while registring worker",error)
    return Response.json(
        {
            success:false,
            message:"Error while resgitring worker"
        },
        {
            status:500
        }
    )
 }
}