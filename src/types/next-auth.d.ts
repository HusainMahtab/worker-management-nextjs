import "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth'{
     interface User{
        _id?:string,
        isVerified?:boolean
        isWorker?:boolean
        username?:string
        profilePic?:string
        password?:string
     }
}

declare module "next-auth" {
    interface Session {
      user: {
       _id?:string,
       isVerified?:boolean,
       username?:string,
       isWorker?:boolean,
       profilePic?:string,
       password?:string
      }& DefaultSession["user"]
    }
  }

  import { JWT } from "next-auth/jwt"

  declare module "next-auth/jwt" {
    interface JWT {
        _id?:string,
       isVerified?:boolean,
       username?:string,
       isWorker?:boolean,
       profilePic?:string
       password?:string
    }
  }