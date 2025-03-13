import mongoose, { Schema } from "mongoose";

interface User {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyCode: string;
    phoneNumber:string,
    isWorker:boolean,
    verifyCodeExpiry: Date;
    profilePic:string
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
    phoneNumber:{
        type:String,
    },
    isWorker:{
        type:Boolean,
        default:false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String
    },
    verifyCodeExpiry: {
        type: Date
    },
    profilePic:{
        type:String,
        default:""
    }
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model<User>("User", userSchema);
