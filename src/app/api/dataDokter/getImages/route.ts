import { NextResponse } from "next/server";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwYlfT_3JoZ2UeF8CAlIHLH0hrFCeR1HDXIOdAvneLJjJAv9f_TCZI-46hgy1cPRs4DoQ/exec?getImages=true";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export async function GET(_req: Request) {
    try {
      const response = await fetch(GAS_URL);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Unexpected response (GET images):", textResponse);
        return NextResponse.json({ error: "API did not return JSON" }, { status: 500 });
      }
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Error fetching images:", error);
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
  }
  
