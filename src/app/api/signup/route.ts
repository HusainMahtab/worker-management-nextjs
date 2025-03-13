import { UserModel } from "@/models/user.model";
import dbConnection from "@/lib/dbConnection";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    dbConnection();
    try {
        const {username,email,phoneNumber,password}=await request.json()
        const isAlreadyExist = await UserModel.findOne({ email });
        const hashPassword = await bcrypt.hash(password, 10);
        const generateCode = Math.round(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');

        if (isAlreadyExist) {
            if (isAlreadyExist.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User with this email already exists",
                    },
                    { status: 400 }
                );
            } else {
                isAlreadyExist.password = hashPassword;
                isAlreadyExist.verifyCode = generateCode;
                isAlreadyExist.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await isAlreadyExist.save();
            }
        } else {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const user = new UserModel({
                username,
                email,
                phoneNumber,
                password: hashPassword,
                verifyCode: generateCode,
                verifyCodeExpiry: expiryDate,
            });
            await user.save();
        }

        return Response.json(
            {
                success: true,
                message: "User signed up successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error registering User:", error);
        return Response.json(
            {
                success: false,
                message: "Error while registering User",
            },
            { status: 500 }
        );
    }
}
