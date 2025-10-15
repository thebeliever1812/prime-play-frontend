import { api } from "@/utils/api";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const cookie = req.headers.get("cookie");
    try {
        const response = await api.get("/auth/session", {
            headers: {
                Cookie: cookie || "",
            },
        });
        if (response.data?.success) {
            return NextResponse.json(
                { authenticated: true, user: response.data?.data },
                { status: 200 }
            );
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                    error: error.response?.data?.message || "Request failed",
                },
                { status: error.response?.status || 500 }
            );
        } else {
            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                    error: "Unknown error occurred",
                },
                { status: 500 }
            );
        }
    }
}
