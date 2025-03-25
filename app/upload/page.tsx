'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setExcelData } from "@/lib/features/pharma/pharmaSlice";
import * as XLSX from 'xlsx';

export default function UploadPage() { 
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const fileBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
      const sheetName1 = workbook.SheetNames[1];
      const worksheet1 = workbook.Sheets[sheetName1];
      const jsonData1: any[] = XLSX.utils.sheet_to_json(worksheet1);
      const sheetName2 = workbook.SheetNames[2];
      const worksheet2 = workbook.Sheets[sheetName2];
      const jsonData2: any[] = XLSX.utils.sheet_to_json(worksheet2);
      const sheetName3 = workbook.SheetNames[3];
      const worksheet3 = workbook.Sheets[sheetName3];
      const jsonData3: any[] = XLSX.utils.sheet_to_json(worksheet3);
      const sheetName4 = workbook.SheetNames[4];
      const worksheet4 = workbook.Sheets[sheetName4];
      const jsonData4: any[] = XLSX.utils.sheet_to_json(worksheet4);
      const finalJsonData = {
        medicine: jsonData,
        distributor: jsonData1,
        purchase: jsonData2,
        sales: jsonData3,
        stock: jsonData4
      }
      dispatch(setExcelData(finalJsonData));
      router.push("home")
    } else {
      setError("Please upload a valid Excel file (.xlsx)");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
        <input type="file" accept=".xlsx" onChange={handleFileChange} className="border p-2 w-full" />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
