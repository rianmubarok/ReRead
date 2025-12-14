import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;

        if (!path || path.length === 0) {
            return NextResponse.json({ error: "Path missing" }, { status: 400 });
        }

        const urlPath = path.join("/");
        // Ensure we don't double up or miss the .json extension logic
        // The user endpoints are like /provinces.json
        // My frontend calls /api/wilayah/provinces -> path=['provinces'] -> target=.../provinces.json

        const targetUrl = `https://wilayah.id/api/${urlPath}.json`;
        console.log(`Proxying request to: ${targetUrl}`);

        const response = await fetch(targetUrl);

        if (!response.ok) {
            console.error(`Proxy upstream error: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `Upstream error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy internal error:", error);
        return NextResponse.json(
            { error: "Internal Proxy Error" },
            { status: 500 }
        );
    }
}
