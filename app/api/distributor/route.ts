import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const { updatedData, name, company, contact, gst, email, website } = await req.json();

    console.log("Received Data:", updatedData);
    console.log("New Distributor Entry:", { name, company, contact, gst, email, website });

    if (!updatedData || typeof updatedData !== "object" || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: "Invalid or empty data" }, { status: 400 });
    }

    const workbook = XLSX.utils.book_new();

    for (const sheetName in updatedData) {
      if (Array.isArray(updatedData[sheetName])) {
        let sheetData = [...updatedData[sheetName]];

        console.log(`Processing sheet: ${sheetName}`);
        console.log("Existing sheet data:", sheetData);
 
        if (sheetName.toLowerCase() === "distributor") {
          const isDuplicate = sheetData.some(
            (row: any) =>
              row.Name?.toLowerCase() === name.toLowerCase() &&
              row.Company?.toLowerCase() === company.toLowerCase()
          );

          if (isDuplicate) {
            return NextResponse.json(
              { error: "Distributor already exists in the sheet" },
              { status: 409 }
            );
          }
 
          sheetData.push({ Name: name, Company: company, Contact: contact, GST: gst, Email: email, Website: website });

          console.log("Updated Distributor sheet data:", sheetData);
        }

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
    }

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="updated_distributors.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error updating Excel file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
