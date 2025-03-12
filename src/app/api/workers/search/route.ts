import { WorkerModel } from "@/models/worker.model";
import dbConnection from "@/lib/dbConnection";

export async function GET(request: Request) {
  try {
    await dbConnection();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase() || "";
    const searchType = searchParams.get("type") || "all";

    let searchQuery = {};

    if (query) {
      switch (searchType) {
        case "name":
          searchQuery = { workerName: { $regex: query, $options: "i" } };
          break;
        case "expertise":
          searchQuery = { workerExperties: { $regex: query, $options: "i" } };
          break;
        case "location":
          searchQuery = { workerLocation: { $regex: query, $options: "i" } };
          break;
        default:
          searchQuery = {
            $or: [
              { workerName: { $regex: query, $options: "i" } },
              { workerExperties: { $regex: query, $options: "i" } },
              { workerLocation: { $regex: query, $options: "i" } },
            ],
          };
      }
    }

    const workers = await WorkerModel.find(searchQuery).select("-workerVerifiedCode -workerVerifiedCodeExpiry");

    return Response.json(
      {
        success: true,
        workers,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error searching workers:", error);
    return Response.json(
      {
        success: false,
        message: "Error searching workers",
      },
      {
        status: 500,
      }
    );
  }
} 