"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { verifySchema } from "@/schemas/verifySchema"
import axios, { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function VerifyCode() {
    const params=useParams<{email:string}>()
    const decodeEmail=decodeURIComponent(params.email)
    const [isVerifing,setIsVerifing]=useState(false)
    const router=useRouter()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        }
    })
    
    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        setIsVerifing(true)
        try {
            const response=await axios.post(`/api/verify-signup-code`,{
                code:data.code,
                email:decodeEmail
            })
            toast({
                title:"Success",
                description:response.data?.message
            })
            //console.log("response",response)
            router.replace('/login')
        } catch (error) {
            setIsVerifing(false)
            console.error(error)
            const axiosError=error as AxiosError<any>
            toast({
                title:"Error",
                description:axiosError.response?.data.message,
                variant:"destructive"
            })
        }
    }

    return (
        <div className="w-full flex justify-center">
            <div className="w-full md:w-[400px] h-fit p-4 mt-[100px] border border-slate-300 rounded-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your verification code send to your gmail.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            isVerifing ? (
                               <Button type="submit" className="bg-slate-400 animate-pulse" disabled>Verifing...</Button>
                            ) : (
                                <Button type="submit">Verify</Button>
                            )
                        }
                    </form>
                </Form>
            </div>
        </div>
    )
}
