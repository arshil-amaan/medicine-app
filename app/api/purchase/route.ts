import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const { updatedData,distributor,item, quantity,price } = await req.json();
    
    if (!updatedData || typeof updatedData !== 'object' || Object.keys(updatedData).length === 0) {
      return NextResponse.json({ error: 'Invalid or empty data' }, { status: 400 });
    }
    const workbook = XLSX.utils.book_new();
 
    for (const sheetName in updatedData) {
      if (Array.isArray(updatedData[sheetName])) { 
        let sheetData = [...updatedData[sheetName]]

        if(sheetName.toLowerCase()=== 'purchase'){
          const isDuplicate = sheetData.some(
            (row: any)=> row.Distributor.toLowerCase()=== distributor.toLowerCase()   
          );
          if(isDuplicate){
            return NextResponse.json(
              { error: 'Medicine and maker already exists in the sheet' },
              { status: 409 }
            );
          }
          sheetData.push({Distributor: distributor, Item: item,Quantity: quantity,Price: price})
          console.log("Updated purchase sheet data:", sheetData);
        }
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook,worksheet,sheetName);
      }
    }
 
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