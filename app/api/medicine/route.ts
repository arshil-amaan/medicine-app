import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const maker = formData.get('maker') as string;
    const salt = formData.get('salt') as string;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    // Read uploaded file
    const fileBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // const data = {
    //   medicine:[
    //     {
    //     },
    //     {
    //     },
    //     {
    //     },
    //   ],
    //   distributor:[
    //     {
        
    //     },
    //     {
        
    //     },
    //     {
        
    //     },
    //   ],
    // }

    // Convert Excel sheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Check if the medicine name already exists
    const isDuplicate = data.some((row: any) => {return row.Name.toLowerCase() === name.toLowerCase() && row.Maker.toLowerCase()=== maker.toLowerCase()});

    if (isDuplicate) {
      return NextResponse.json({ error: 'Medicine and maker already exists in the sheet' }, { status: 409 });
    }

    // Append new data
    data.push({ Name: name, Maker: maker, Salt: salt });

    // Convert back to worksheet & update workbook
    const updatedWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = updatedWorksheet;

    // Generate buffer for response
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="updated_data.xlsx"',
      },
    });

  } catch (error) {
    console.error('Error updating Excel file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
 