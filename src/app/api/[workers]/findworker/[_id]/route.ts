import { NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';
import { WorkerModel } from '@/models/worker.model';

export async function GET(request: Request, { params }: { params: { _id: string } }) {
    await dbConnection();

    // Extract the `id` from the route parameters
    const { _id } =await params;
   // console.log(_id)

    if (!_id) {
        return NextResponse.json(
            { success: false, message: "_id is required" },
            { status: 400 }
        );
    }

    try {
        const worker = await WorkerModel.findById(_id);
        if (!worker) {
            return NextResponse.json(
                { success: false, message: "Worker not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true,worker},
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while fetching worker by id:", error);
        return NextResponse.json(
            { success: false, message: "Error while fetching worker by id" },
            { status: 500 }
        );
    }
}