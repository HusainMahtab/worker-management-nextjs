import dbConnection from "@/lib/dbConnection";
import { UserModel } from "@/models/user.model";

export async function POST(request:Request) {
    dbConnection()
    const {email,code}=await request.json()
    try {
        const user=await UserModel.findOne({email})
        if(user){
            if(user.isVerified===true){
                return Response.json(
                    {
                        success:false,
                        message:"user already verified"
                    },
                    {
                        status:400
                    }
                )
            }
            const isCodeValid=user.verifyCode===code
            const isCodeNotExpired=new Date(user.verifyCodeExpiry) > new Date()
            if(isCodeValid && isCodeNotExpired){
                user.isVerified=true
                await user.save()
            }else{
                return Response.json(
                    {
                        success:false,
                        message:"incorrect credentials"
                    },
                    {
                        status:403
                    }
                )
            }
            return Response.json(
                {
                    success:true,
                    message:"user verified successfully"
                },
                {
                    status:201
                }
            )
    
        }
        
    } catch (error) {
        console.error("Error while verify user",error)
        return Response.json(
            {
                success:false,
                message:"Error during verify user"
            },
            {
                status:500
            }
        )
    }
}