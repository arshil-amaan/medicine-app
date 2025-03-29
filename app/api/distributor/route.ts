import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const { updatedData, name, company, contact, gst, email, website } = await req.json();
 

    if (!updatedData || typeof updatedData !== "object" || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: "Invalid or empty data" }, { status: 400 });
    }

    const workbook = XLSX.utils.book_new();

    for (const sheetName in updatedData) {
      if (Array.isArray(updatedData[sheetName])) {
        let sheetData = [...updatedData[sheetName]];
 
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
          const nextID =sheetData.length>0? Math.max(...sheetData.map((row:any)=>row.ID||0))+1:1;
          sheetData.push({ ID:nextID, Name: name, Company: company, Contact: contact, GST: gst, Email: email, Website: website });
 
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
