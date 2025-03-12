"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import axios from "axios";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";

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

interface WorkerSearchProps {
  onSearchResults: (workers: Worker[]) => void;
}

export function WorkerSearch({ onSearchResults }: WorkerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/workers/search?query=${debouncedSearch}&type=${searchType}`);
      onSearchResults(response.data.workers);
    } catch (error) {
      console.error("Error searching workers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedSearch, searchType]);

  return (
    <div className="w-full px-4 md:px-0 max-w-3xl mx-auto mt-2 md:mt-0">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="w-full">
          <Input
            placeholder="Search workers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 md:gap-4">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Search by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="expertise">Expertise</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="w-[100px] shrink-0"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
            ) : (
              <>
                <Search className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Search</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 