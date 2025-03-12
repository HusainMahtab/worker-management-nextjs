import mongoose, { Schema } from "mongoose";

interface Report{
    reportFrom:string,
    reportTo:string,
    reports:[string]
}

const reportSchema:Schema<Report>=new mongoose.Schema({
   reportFrom:{
    type:String,
    required:[true,"reported from is required"]
   },
   reportTo:{
    type:String,
    required:[true,"reported To is required"]
   },
   reports:[String]
},{timestamps:true})

export const Report = mongoose.models.Report || mongoose.model<Report>("Report", reportSchema)
