"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { BadgeCheck, PhoneCall, MapPin, Mail } from "lucide-react";
import { IoMdStar } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { RatingReview } from "@/components/RatingReview";
import { ReviewList } from "@/components/ReviewList";

interface Worker {
  workerName: string;
  workerEmail: string;
  workerPhoneNumber: number;
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

function WorkerDetails() {
  const [workerDetails, setWorkerDetails] = useState<Worker>({} as Worker);
  const [checkedItems, setCheckedItems] = useState({
    behaveBadly: false,
    extraCharge: false,
    badService: false,
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [bookingType, setBookingType] = useState<'daily' | 'monthly'>('daily');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const params = useParams<{ _id: string }>();
  const [loading, setLoading] = useState(true);
  const profileName = workerDetails.workerName;
  const slicedName = profileName
    ? profileName[0] +
      (profileName.includes(" ")
        ? profileName[profileName.indexOf(" ") + 1]
        : "")
    : "U";

  const session = useSession();
  const currentUser = session.data?.user.email;
  const [reviews, setReviews] = useState([]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const fetchWorkerDetails = async () => {
    try {
      const response = await axios.get(`/api/wokers/findworker/${params._id}`);
      setWorkerDetails(response.data.worker);
      setLoading(false);
      console.log("response", response);
    } catch (error) {
      console.error("error while fetching worker by _id", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/workers/rate-review?workerId=${params._id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchWorkerDetails();
    if (params._id) {
      fetchReviews();
    }
  }, [params._id]);

  useEffect(() => {
    if (startDate && endDate && workerDetails) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (bookingType === 'daily') {
        setTotalAmount(diffDays * workerDetails.workerChargePerDay);
      } else {
        const months = Math.ceil(diffDays / 30);
        setTotalAmount(months * workerDetails.workerChargePerMonth);
      }
    }
  }, [startDate, endDate, bookingType, workerDetails]);

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    const selectedReports = Object.keys(checkedItems).filter(
      (key) => checkedItems[key as keyof typeof checkedItems]
    );
    const reportData = {
      reportFrom: currentUser || "",
      reportTo: workerDetails.workerEmail,
      reports: selectedReports,
    };
    try {
      const response = await axios.post(
        "/api/reports/create-reports",
        reportData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "Report Submit Successfully",
      });
      setIsReportDialogOpen(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      const axiosError = error as AxiosError<any>;
      const message = axiosError.response?.data.message;
      toast({
        title: "Report Submission Failed!",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Please select dates",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Please login to book",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.post("/api/bookings/create", {
        bookingFrom: currentUser,
        bookingTo: workerDetails.workerEmail,
        startDate,
        endDate,
        totalAmount,
        bookingType,
        workerName: workerDetails.workerName,
        userName: session.data?.user?.username
      });

      toast({
        title: "Booking Successful",
        description: "Worker will be notified of your booking request."
      });
      setIsBookingDialogOpen(false);
    } catch (error) {
      console.error("Error creating booking:", error);
      const axiosError = error as AxiosError<any>;
      toast({
        title: "Booking Failed",
        description: axiosError.response?.data.message || "Error creating booking",
        variant: "destructive"
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
        <div className="w-full md:w-[900px] min-h-[500px] flex flex-col gap-4 p-4">
          <div className="md:flex gap-4">
            <div className="w-wull h-fit grid place-items-cente place-content-center bg-slate-200 rounded-lg text-black">
              {workerDetails.workerProfilePicture ? (
                <img
                  src={workerDetails?.workerProfilePicture}
                  alt="profile pic"
                  className=" w-[350px] h-[400px] rounded-lg mix-blend-multiply"
                />
              ) : (
                <div className="w-[300px] h-[300px] flex justify-center bg-slate-700 text-white text-5xl  items-center">
                  <p className="text-5xl">{slicedName}</p>
                </div>
              )}
              <div className="flex items-center justify-center">
                <p className="text-center p-2">{workerDetails?.workerName}</p>
                <BadgeCheck className="text-green-600" />
              </div>
            </div>
            <div className="w-full h-full">
              <div className="w-full md:w-1/2 flex justify-between p-2">
                <p className="p-2 bg-slate-400">
                  {workerDetails?.workerExperties}
                </p>
                <div>
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
                  &ldquo;One of a kind service&rdquo;
                </h1>
                <p className="font-[DM Sans] text-[14px] leading-[18px] text-center  text-[#887777]">
                  {workerDetails?.workerProfileBio}
                </p>
              </div>
              <div className="p-2 flex gap-4">
                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsBookingDialogOpen(true)}>Book Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Book Worker</DialogTitle>
                      <DialogDescription>
                        Book <span className="text-blue-400 text-lg font-serif">{workerDetails?.workerName}</span> for your work. Select dates and booking type.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Booking Type</label>
                        <select 
                          className="p-2 border rounded-md bg-slate-500"
                          value={bookingType}
                          onChange={(e) => setBookingType(e.target.value as 'daily' | 'monthly')}
                        >
                          <option value="daily">Daily</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <input 
                          type="date"
                          className="p-2 border rounded-md bg-slate-500"
                          onChange={(e) => setStartDate(new Date(e.target.value))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">End Date</label>
                        <input 
                          type="date"
                          className="p-2 border rounded-md bg-slate-500"
                          onChange={(e) => setEndDate(new Date(e.target.value))}
                          min={startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <span>₹{totalAmount}</span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleBooking}>
                        Confirm Booking
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsReportDialogOpen(true)}>Report</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Report</DialogTitle>
                      <DialogDescription>
                        Make sure your are reporting{" "}
                        <span className="text-sm font-bold text-red-400">
                          {workerDetails?.workerName}
                        </span>
                        . Click report when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="items-top flex space-x-2">
                          <Checkbox
                            id="behaveBadly"
                            name="behaveBadly"
                            checked={checkedItems.behaveBadly}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(checked as boolean, "behaveBadly")
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="abusing"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Behave Badly
                            </label>
                          </div>
                        </div>
                        <div className="items-top flex space-x-2">
                          <Checkbox
                            id="extraCharge"
                            name="extraCharge"
                            checked={checkedItems.extraCharge}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(checked as boolean, "extraCharge")
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="extraCharge"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Extra Charge
                            </label>
                          </div>
                        </div>
                        <div className="items-top flex space-x-2">
                          <Checkbox
                            id="badService"
                            name="badService"
                            checked={checkedItems.badService}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(checked as boolean, "badService")
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="badService"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Bad Service
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleSubmit}>
                        Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Ratings & Reviews</h2>
              <RatingReview workerId={params._id} onReviewAdded={fetchReviews} />
            </div>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkerDetails;