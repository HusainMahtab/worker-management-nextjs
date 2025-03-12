import { NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnection";
import { UserModel } from "@/models/user.model";

export async function POST(request: Request) {
    try {
        await dbConnection();
        const { email, code } = await request.json();

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already verified"
                },
                { status: 400 }
            );
        }

        if (user.verificationCode !== code) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid verification code"
                },
                { status: 400 }
            );
        }

        if (user.verificationCodeExpiry < new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Verification code has expired"
                },
                { status: 400 }
            );
        }

        // Update user verification status
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Email verified successfully"
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error in email verification:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error during email verification"
            },
            { status: 500 }
        );
    }
} 