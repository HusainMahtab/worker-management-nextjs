import {z} from "zod"

export const createWorkerSchema=z.object({
    workerPhoneNumber:z.string({message:"phone number is required"}),
    workerExperties:z.string({message:"required fileds"}),
    workerProfileBio:z.string({message:"required fileds"}),
    workerChargePerDay:z.number(),
    workerChargePerMonth:z.number(),
    workerLocation:z.string(),
})

