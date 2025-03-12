"use client";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { BadgeCheck, Mail, MapPin, PhoneCall } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoMdStar } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Worker {
  _id: string;
  workerName: string;
  workerEmail: string;
  workerPhoneNumber: string;
  workerExperties: string;
  workerProfileBio: string;
  isWorkerAvailable: boolean;
  workerChargePerDay: number;
  workerChargePerMonth: number;
  workerLocation: string;
  workerProfilePicture: string;
  isWorkerVerified: boolean;
  workerVerifiedCode: string;
  workerVerifiedCodeExpiry: Date;
  ratings: number;
  reviews: [];
}

function Profile() {
  const [workerDetails, setWorkerDetails] = useState<Worker>({} as Worker);
  const [workerData, setWorkerData] = useState({
    workerName: "",
    workerEmail: "",
    workerPhoneNumber: "",
    workerExperties: "",
    workerProfileBio: "",
    workerChargePerDay: 0,
    workerChargePerMonth: 0,
    workerLocation: "",
    isWorkerAvailable: true,
  });
  const params = useParams<{ u: string }>();
  const decodedParams = decodeURIComponent(params.u);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const profileName = session?.user?.username;
  const slicedName = profileName
    ? profileName[0] +
      (profileName.includes(" ")
        ? profileName[profileName.indexOf(" ") + 1]
        : "")
    : "U";

  const fetchWorkerDetails = async () => {
    try {
      const response = await axios.get(
        `/api/wokers/getworkerByemail/${decodedParams}`
      );
      setWorkerDetails(response.data.worker);
      // Initialize workerData with the fetched worker details
      setWorkerData({
        workerName: response.data.worker.workerName,
        workerEmail: response.data.worker.workerEmail,
        workerPhoneNumber: response.data.worker.workerPhoneNumber,
        workerExperties: response.data.worker.workerExperties,
        workerProfileBio: response.data.worker.workerProfileBio,
        workerChargePerDay: response.data.worker.workerChargePerDay,
        workerChargePerMonth: response.data.worker.workerChargePerMonth,
        workerLocation: response.data.worker.workerLocation,
        isWorkerAvailable: response.data.worker.isWorkerAvailable,
      });
      setLoading(false);
      console.log("response", response);
    } catch (error) {
      console.error("error while fetching worker by _id", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWorkerDetails();
  }, [decodedParams]);

  const handleChangeDialog = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWorkerData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    console.log("value", value);
  };

  const handleUpdateProfile = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/workers/editworker/${id}`,
        workerData
      );
      console.log("response", response);
      toast({
        title: "Success",
        description: response.data?.message,
      });
      setIsDialogOpen(false);
      await fetchWorkerDetails();
    } catch (error) {
      console.error("error while updating worker profile", error);
      const axiosError = error as AxiosError<any>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfilePic = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUploading(true);
    const file = e.target.files?.[0];
    console.log("file path", file);
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);
    //formData.append("_id", workerDetails._id);

    try {
      const response = await axios.post(
        `/api/workers/update-profile-pic/${workerDetails._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "Success",
        description: response.data?.message,
      });
      await fetchWorkerDetails(); // Refresh worker details to show the updated image
      setUploading(false);
    } catch (error) {
      console.error("error while updating profile picture", error);
      const axiosError = error as AxiosError<any>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {loading ? (
        <div className="flex justify-center items-center gap-2 h-screen">
          <div className="p-4 border-2 border-b animate-spin border-b-white rounded-full "></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="w-full md:w-[900px] h-[500px] md:flex md:gap-4">
          <div>
            <div className="w-full h-fit flex justify-center">
              <div className="w-[300px] h-[300px] rounded-full flex justify-center">
                {workerDetails?.workerProfilePicture ? (
                  <img
                    src={workerDetails.workerProfilePicture}
                    alt="profile pic"
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex justify-center bg-slate-900 rounded-full  items-center">
                    <p className="text-5xl">{slicedName}</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleUpdateProfilePic}
                accept="image/*"
              />
              {uploading ? (
                <Button
                  className="w-fit p-2 absolute mt-[263px] bg-slate-800 text-white font-bold rounded-b-[10px]"
                  disabled
                >
                  Updating...
                </Button>
              ) : (
                <Button
                  className="w-fit p-2 absolute mt-[263px] rounded-b-[10px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Update Pic
                </Button>
              )}
            </div>
            <div className="flex w-full justify-center items-center p-4 gap-2">
              <p>{workerDetails.workerName}</p>
              <BadgeCheck className="text-green-600" />
            </div>
          </div>
          <div className="w-full h-full">
            <div className="w-full flex justify-between p-2">
              <p className="p-2 text-xl">{workerDetails?.workerExperties}</p>
              <div className="w-full flex justify-center items-center">
                {workerDetails?.isWorkerAvailable ? (
                  <p className="px-2 py-[2px] bg-green-400 rounded-full">
                    Available
                  </p>
                ) : (
                  <p className="px-2 py-1 rounded-full bg-red-400">
                    Not Available
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 p-2">
              <PhoneCall />
              <p>{workerDetails?.workerPhoneNumber}</p>
            </div>
            <div className="flex items-center gap-2 p-2">
              <MapPin />
              <p>{workerDetails?.workerLocation}</p>
            </div>
            <div className="flex items-center gap-2 p-2">
              <Mail />
              <p>{workerDetails?.workerEmail}</p>
            </div>
            <div className="flex items-center justify-evenly p-2">
              <p>Charge/Day- ₹{workerDetails?.workerChargePerDay}</p> |
              <p>Charge/Month- ₹{workerDetails?.workerChargePerMonth}</p>
            </div>
            <div className="flex items-center gap-4 p-2">
                <div className="flex gap-1 text-[20px]">
                  {[...Array(5)].map((_, index) => (
                    <IoMdStar
                      key={index}
                      className={`${
                        index < (workerDetails?.ratings || 0)
                          ? "text-yellow-500"
                          : "text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({workerDetails?.ratings?.toFixed(1) || "0.0"})
                </span>
              </div>
            <div className="w-full grid place-content-center mt-2 p-2 items-center ">
              <h1 className="font-[DM Sans] text-center mb-1 font-bold text-[22px] leading-[22px]">
                “Description”
              </h1>
              <p className="font-[DM Sans] text-[14px] leading-[18px] text-center  text-[#887777]">
                {workerDetails?.workerProfileBio}
              </p>
            </div>
            <div className="p-4">
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    setIsDialogOpen(false);
                    // Optionally reset workerData when dialog closes
                    setWorkerData({
                      workerName: "",
                      workerEmail: "",
                      workerPhoneNumber: "",
                      workerExperties: "",
                      workerProfileBio: "",
                      workerChargePerDay: 0,
                      workerChargePerMonth: 0,
                      workerLocation: "",
                      isWorkerAvailable: true,
                    });
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(true);
                      setWorkerData({
                        workerName: workerDetails.workerName,
                        workerEmail: workerDetails.workerEmail,
                        workerPhoneNumber: workerDetails.workerPhoneNumber,
                        workerExperties: workerDetails.workerExperties,
                        workerProfileBio: workerDetails.workerProfileBio,
                        workerChargePerDay: workerDetails.workerChargePerDay,
                        isWorkerAvailable: workerDetails.isWorkerAvailable,
                        workerChargePerMonth:
                        workerDetails.workerChargePerMonth,
                        workerLocation: workerDetails.workerLocation,
                      });
                    }}
                  >
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="name" className="text-right">
                        Availability
                      </Label>
                      <Select onValueChange={(value) => setWorkerData((prev) => ({ ...prev, isWorkerAvailable: value === "true" }))}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Availble" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Availble</SelectItem>
                          <SelectItem value="false">NotAvailble</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        PhoneNumber
                      </Label>
                      <Input
                        id="phone"
                        value={workerData.workerPhoneNumber}
                        name="workerPhoneNumber"
                        className="col-span-3"
                        onChange={handleChangeDialog}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Charge/Day
                      </Label>
                      <Input
                        id="charge/day"
                        value={workerData.workerChargePerDay}
                        name="workerChargePerDay"
                        className="col-span-3"
                        onChange={handleChangeDialog}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Charge/Month
                      </Label>
                      <Input
                        id="charge/month"
                        value={workerData.workerChargePerMonth}
                        name="workerChargePerMonth"
                        className="col-span-3"
                        onChange={handleChangeDialog}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Profile Bio
                      </Label>
                      <Textarea
                        id="profile-bio"
                        value={workerData.workerProfileBio}
                        name="workerProfileBio"
                        className="col-span-3"
                        onChange={handleChangeDialog}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={(e) => handleUpdateProfile(e, workerDetails._id)}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
