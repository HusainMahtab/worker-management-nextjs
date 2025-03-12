import mongoose, { Schema } from "mongoose";

interface User {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationCode: string;
    verificationCodeExpiry: Date;
}

const userSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    },
    verificationCodeExpiry: {
        type: Date
    }
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<User>("User", userSchema);
