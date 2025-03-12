import mongoose, { Schema } from "mongoose";

interface Worker{
    workerName:string,
    workerEmail:string,
    //workerPassword:string,
    workerPhoneNumber:number,
    workerExperties:string,
    workerProfileBio:string,
    isWorkerAvailable:boolean,
    workerChargePerDay:number,
    workerChargePerMonth:number,
    workerLocation:string,
    workerProfilePicture:string,
    isWorkerVerified:boolean,
    workerVerifiedCode:string,
    workerVerifiedCodeExpiry:Date,
    ratings:number,
    reviews:[]
}

const WorkerSchema:Schema<Worker>=new Schema({
    workerName:{
        type:String,
        required:[true,"workername is required"],
        trim:true,
    },
    workerEmail:{
        type:String,
        required:[true,"worker email is required"],
        trim:true,
        unique:[true,"worker email must be unique"]
    },
    // workerPassword:{
    //     type:String,
    //     required:[true,"worker password is requied"]
    // },
    workerPhoneNumber:{
        type:Number,
        required:[true,"phone number is required"],
    },
    workerExperties:{
        type:String,
        required:[true,"worker-experties is required"]
    },
    workerProfileBio:{
        type:String,
    },
    isWorkerAvailable:{
        type:Boolean,
        required:[true,"worker-availbility status is required"],
        default:true
    },
    workerChargePerDay:{
        type:Number,
        required:[true,"worker fee/day is required"]
    },
    workerChargePerMonth:{
        type:Number,
    },
    workerLocation:{
        type:String,
        required:[true,"worker location is required"]
    },
    workerProfilePicture:{
        type:String,
    },
    isWorkerVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    workerVerifiedCode:{
        type:String,
        required:[true,"verification code is required"]
    },
    workerVerifiedCodeExpiry:{
        type:Date,
        required:[true,"verification code expiry is required"]
    },
    ratings:{
        type:Number
    },
    reviews:{
        type:[{}]
    }
})

export const WorkerModel=(mongoose.models.Worker as mongoose.Model<Worker>) || mongoose.model<Worker>("Worker",WorkerSchema)