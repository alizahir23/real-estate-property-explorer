import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON body
    const properties = await request.json();

    // Get the path to the properties.json file
    const filePath = path.join(process.cwd(), "public", "properties.json");

    // Write the updated properties to the file
    await fs.writeFile(filePath, JSON.stringify(properties, null, 2));

    return NextResponse.json(
      {
        message: "Properties saved successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error saving properties:", error);
    return NextResponse.json(
      {
        message: "Failed to save properties",
      },
      {
        status: 500,
      }
    );
  }
}
