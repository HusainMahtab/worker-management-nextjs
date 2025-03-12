import { NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnection";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(request: Request) {
    try {
        await dbConnection();
        const { username, email, password } = await request.json();

        // Check if user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User with this email or username already exists"
                },
                { status: 400 }
            );
        }

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verificationCode,
            verificationCodeExpiry,
            isVerified: false
        });

        // Save user first
        await newUser.save();
        // Send verification email
    
            await sendEmail({
                email,
                subject:`verification code`,
                message:`your verification code is ${verificationCode}`
            })
    
        
       

        return NextResponse.json(
            {
                success: true,
                message: "Registration successful! Please check your email for verification code."
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error in signup:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Error during registration"
            },
            { status: 500 }
        );
    }
} 