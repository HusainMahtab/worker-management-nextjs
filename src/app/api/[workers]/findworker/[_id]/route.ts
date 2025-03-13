import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnection';
import { WorkerModel } from '@/models/worker.model';

export async function GET(request: NextRequest) {
    await dbConnection();

    // Get the _id from the URL using request.url
    const url = new URL(request.url);
    const _id = url.pathname.split('/').pop();

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
            { success: true, worker },
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