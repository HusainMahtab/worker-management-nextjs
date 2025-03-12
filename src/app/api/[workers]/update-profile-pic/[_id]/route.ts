import dbConnection from "@/lib/dbConnection";
import { WorkerModel } from "@/models/worker.model";
import cloudinary from "@/lib/cloudinary";

export async function POST(request:Request,{params}:{params:{_id:string}}){
    dbConnection()
    try {
        const formData = await request.formData();
        const {_id}=await params
        const profilePic = formData.get("profilePic") as File | null;
        console.log("profilePic", profilePic);

        // Upload profile picture to Cloudinary
        let profilePicUrl = "";
        if (profilePic) {
            const arrayBuffer = await profilePic.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
        
            try {
                const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer.toString('base64')}`, {
                    folder: "user_profiles",
                });
                profilePicUrl = uploadResponse.secure_url;
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                throw new Error("Profile picture upload failed.");
            }
        }
        console.log("profilePic", profilePicUrl);
        const worker=await WorkerModel.findById(_id)
        if(worker){
            worker.workerProfilePicture=profilePicUrl
            await worker.save()
        }
        return Response.json(
            {
                success: true,
                message: "Profile Picture Updated",
            },
            { status: 200 }
        )
    } catch (error) {
        Response.json(
            {
                success: false,
                message: "Profile Picture Update Failed",
            },
            { status: 500 }
        )
    }
    
}
