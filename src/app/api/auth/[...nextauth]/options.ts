import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnection from "@/lib/dbConnection";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs"

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
           id:"credentials",
           name:"Creadentials",
           credentials: {
            email: { label: "Email", type: "text"},
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials:any):Promise<any>{
            await dbConnection()
            try {
                const user=await UserModel.findOne({
                    $or:[
                        {email:credentials.identifier},
                    ]
                })
                console.log("user",user)
                if(!user){
                    throw new Error("user not found with this email")
                }
                if(!user.isVerified){
                    throw new Error("please verify your account befoure login")
                }
                const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                if(isPasswordCorrect){
                    return user
                }else{
                    throw new Error("Invalid Credentials")
                }
            } catch (error:any) {
                throw new Error(error)
            }
          }
        })
    ],
    callbacks:{
      async jwt({token,user}){
        if(user){
            token._id=user?._id?.toString()
            token.username=user.username
            token.isVerified=user.isVerified
            token.profilePic=user.profilePic
            token.isWorker=user.isWorker
            token.email=user.email
            token.password=user.password
        }
        return token
      },
      async session({session,token}){
        if(token){
            session.user._id=token?._id
            session.user.email=token?.email
            session.user.username=token?.username
            session.user.isVerified=token?.isVerified
            session.user.isWorker=token?.isWorker
            session.user.profilePic=token?.profilePic
            session.user.password=token?.password
        }
        return session
      }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.JWT_SECRET_KEY
}