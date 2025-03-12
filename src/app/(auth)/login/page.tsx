"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Eye} from "lucide-react"
import {EyeClosed} from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schemas/signInSchema"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {signIn} from "next-auth/react"
import Link from "next/link"
import { useState } from "react"


export default function LoginForm() {
  const {toast}=useToast()
  const router=useRouter()
  const [isLogin,setIsLogin]=useState(false)
  const form=useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      email: "",
      password: ""
    }
  })

  const handleOnSubmit=async(data:z.infer<typeof signInSchema>)=>{
    setIsLogin(true)
    const response = await signIn('credentials', {
      redirect: false,
      identifier: data.email, // Ensure correct field
      password: data.password,
    });
  
    console.log("Sign-in Response:", response); // Debugging
  
    if (response?.ok) {
      toast({ title: "Login Successful" });
  
      // Wait for session update before redirecting
      // setTimeout(() => {
      //   router.replace('/dashboard');
      // }, 500);
      setIsLogin(false)
      router.replace("/")
    } else {
      
      toast({
        title: "Login Failed",
        description: response?.error || "Incorrect username or password",
        variant: "destructive",
      });
      setIsLogin(false)
    }
  }

  return (
   <div className="w-full h-fit flex justify-center mt-12 md:mt-0">
    <div className="w-full md:w-[400px] h-auto p-4 border border-slate-300 rounded-md">
     <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormMessage/>
              <div className="w-full text-right">
                <Link href={""} className="hover:underline font-serif font-semibold">ForgetPassword</Link>
              </div>
            </FormItem>
          )}
        />
        {
          isLogin ? (
            <Button type="submit" className="font-semibold font-serif text-md bg-slate-500" disabled>Signing...</Button>
          ) : (
            <Button type="submit" className="font-semibold font-serif text-md">SignIn</Button>
          )
        }
      </form>
      <div className="w-full flex mt-6 justify-center gap-4">
        <p>Don't have account ? </p>
        <Link href={"/signup"} className="font-semibold hover:underline font-serif">Signup</Link>
      </div>
     </Form>
     </div>
   </div>
  )
}
