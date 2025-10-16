import { api } from "@/utils/api";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    try {
        const response = await api.post("/user/login", body);

        const data = response.data;
        return NextResponse.json(data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Forward the original status code and message
            const message =
                error.response?.data?.message || "Something went wrong";
            const status = error.response?.status || 500;
            return NextResponse.json({ message }, { status });
        }

        return NextResponse.json(
            { message: "Unexpected error" },
            { status: 500 }
        );
    }
}
