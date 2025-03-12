"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createWorkerSchema } from "@/schemas/create-worker-schema";
import { indianLocations, workers } from "../../helpers/worker";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateWorker() {
  const {data:session}=useSession()
  const username=session?.user.username
  const email=session?.user.email
  const [isSubmitting,setIsSubmitting]=useState(false)
  const router=useRouter()
  const form = useForm<z.infer<typeof createWorkerSchema>>({
    resolver: zodResolver(createWorkerSchema),
    defaultValues: {
      workerPhoneNumber: "",
      workerProfileBio: "",
      workerChargePerDay: 0,
      workerChargePerMonth: 0,
      workerExperties: "",
      workerLocation: "",
    },
  });
  

  const onSubmit = async(data: z.infer<typeof createWorkerSchema>) => {
    setIsSubmitting(true)
     try {
      const response=await axios.post(`/api/workers/create-workers`,{
        workerPhoneNumber:data.workerPhoneNumber,
        workerProfileBio:data.workerProfileBio,
        workerChargePerDay:Number(data.workerChargePerDay),
        workerChargePerMonth:Number(data.workerChargePerMonth),
        workerExperties:data.workerExperties,
        workerLocation:data.workerLocation,
        workerName:username,
        workerEmail:email,
      })
      toast({
        title:"Success",
        description:response.data.message
      })
      setIsSubmitting(false)
      router.replace(`/verify-worker/${email}`)
     } catch (error) {
      console.error("Error during creating workers",error)
      const axiosError=error as AxiosError<any>
      toast({
        title:"Error",
        description:axiosError.response?.data.message || "Error during creating workers",
        variant:"destructive"
      })
      setIsSubmitting(false)
     }
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="w-full md:w-[400px] rounded border border-slate-300 h-fit p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workerPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workerProfileBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="write profile bio" {...field} />
                  </FormControl>
                  <FormDescription>Write your profile bio.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workerChargePerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charge/Day</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="charge/day in ₹"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    write your charge in one day.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workerChargePerMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charge/Month</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="charge/month in ₹"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    write your charge in one month.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workerExperties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experties</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a your experties to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem value={worker.expertise} key={worker.id}>
                          {worker.expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workerLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indianLocations.map((location) => (
                        <SelectItem value={location.city} key={location.id}>
                          {location.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              isSubmitting ? (
               <Button type="submit" className="bg-slate-600 animate-pulse">Submiting...</Button>
              ) : (
               <Button type="submit">Submit</Button>
              )
            }
          </form>
        </Form>
      </div>
    </div>
  );
}
