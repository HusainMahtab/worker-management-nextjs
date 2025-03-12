"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdStar } from "react-icons/io";
import { BadgeCheck, PhoneCall, MapPin, UserRoundSearch } from "lucide-react";
import Link from "next/link";
import { WorkerSearch } from "@/components/WorkerSearch";

interface Worker {
  _id: string;
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

export default function Home() {
  const [workerData, setWorkerData] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`/api/workers/get-workers`);
      console.log(response.data.workers);
      setWorkerData(response.data.workers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workers");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSearchResults = (results: Worker[]) => {
    setWorkerData(results);
  };

  return (
    <div className="w-full min-h-screen pb-8">
      <div className="sticky top-[50px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
        <WorkerSearch onSearchResults={handleSearchResults} />
      </div>
      <div className="px-4 md:px-8 mt-4">
        {loading ? (
          <div className="w-full flex justify-center items-center gap-2 h-[60vh]">
            <div className="p-4 border-2 border-b animate-spin border-b-white rounded-full"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="flex justify-center gap-4 flex-wrap">
            {workerData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-500">No workers found</p>
                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
              </div>
            ) : (
              workerData.map((worker) => (
                <Link href={`/worker-details/${worker._id}`} key={worker._id}>
                  <div className="w-[388px] h-[371px] flex flex-col gap-8 border-[1px] border-[#D7D7D7] hover:shadow-lg hover:shadow-[#bdbbbb] rounded-[20px] bg-[#44503955] shadow-lg">
                    <div className="w-[386px] h-[54px] bg-[#636262] rounded-t-[20px] p-4 px-8">
                      <h1 className="w-full font-[Nunito] text-white font-bold text-[30px] leading-[20px]">
                        {worker?.workerExperties}
                      </h1>
                    </div>
                    <div className="w-full h-[60px] flex justify-evenly">
                      <div className="w-full p-2 h-[60px] flex justify-between items-center">
                        {worker.workerProfilePicture ? (
                          <div className="w-[100px] h-[100px] bg-[#515151] rounded-full grid place-content-center place-items-center text-[40px]">
                            <img
                              className="w-full h-full rounded-full"
                              src={worker.workerProfilePicture}
                              alt="profile pic"
                            />
                          </div>
                        ) : (
                          <div className="w-[100px] h-[100px] bg-[#515151] rounded-full grid place-content-center place-items-center text-[40px]">
                            <p className="">
                              {worker.workerName
                                ? worker.workerName[0] +
                                  (worker.workerName.includes(" ")
                                    ? worker.workerName[
                                        worker.workerName.indexOf(" ") + 1
                                      ]
                                    : "")
                                : "U"}
                            </p>
                            <p className="text-green-500">
                              {!worker.isWorkerVerified ? <BadgeCheck /> : ""}
                            </p>
                          </div>
                        )}
                        <div className="grid gap-2">
                          <h1 className="font-[DIN Medium] font-semibold text-[20px] text-[#fff1f1] leading-[28px]">
                            {worker?.workerName}
                          </h1>
                          <div className="flex gap-1">
                            <MapPin />
                            <p className="font-[Nexa Light] text-slate-300">
                              {worker?.workerLocation}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <PhoneCall />
                            <p>{worker?.workerPhoneNumber}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-[190px] flex justify-center items-center h-[28px]">
                        {worker?.isWorkerAvailable === true ? (
                          <p className="font-[Nexa Light] text-[16px] text-center mx-2 leading-[28px] text-white bg-green-400 px-2 rounded-full">
                            Available
                          </p>
                        ) : (
                          <p className="font-[Nexa Light] text-[16px] text-center w-full mx-2 leading-[28px] text-white bg-red-400 px-2 rounded-full">
                            Not Able
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="">
                      <div className="w-[140px] h-[24px] flex justify-center pl-2 gap-1 text-[20px] text-[#EEDE4D]">
                        {[...Array(5)].map((_, index) => (
                          <IoMdStar
                            key={index}
                            className={`${
                              index < (worker?.ratings || 0)
                                ? "text-yellow-500"
                                : "text-gray-700"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-300">
                          ({worker?.ratings?.toFixed(1) || "0.0"})
                        </span>
                      </div>
                      <div className="p-2 px-4 w-full flex justify-evenly">
                        <p>Charge/Day- ₹{worker?.workerChargePerDay}</p>|
                        <p>Charge/Month- ₹{worker?.workerChargePerMonth}</p>
                      </div>
                      <div className="w-full grid place-content-center mt-2 pl-2 items-center ">
                        <h1 className="font-[DM Sans] text-center mb-1 font-bold text-[22px] leading-[22px]">
                          "One of a kind service"
                        </h1>
                        <p className="font-[DM Sans] text-[14px] pl-2 leading-[18px] line-clamp-5 px-3 text-[#887777]">
                          {worker?.workerProfileBio}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
