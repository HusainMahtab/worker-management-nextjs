import dbConnection from "@/lib/dbConnection";
import { Report } from "@/models/worker-reports.model";

export async function POST(request:Request){
    dbConnection()
    try {
        const {reportFrom,reportTo,reports} =await request.json()
       // console.log(reportFrom,reportTo,reports)
        if(!reportFrom){
            return Response.json(
                {
                    success:false,
                    message:"reportFrom is required"
                },
                {
                    status:404
                }
            )
        }
        if(!reportTo){
            return Response.json(
                {
                    success:false,
                    message:"reportTo is required"
                },
                {
                    status:404
                }
            )
        }
        if(!reports){
            return Response.json(
                {
                    success:false,
                    message:"reports is required"
                },
                {
                    status:404
                }
            )
        }
        const report=new Report({
            reportFrom,
            reportTo,
            reports
        })
        
        await report.save()
        return Response.json(
            {
                success:true,
                message:"report submit successfully"
            },
            {
                status:201
            }
        )

    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"Error In post reports"
            },
            {
                status:500
            }
        )
    }
}