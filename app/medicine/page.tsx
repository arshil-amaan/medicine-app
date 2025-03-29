'use client';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';

export default function Medicine() {
  const [name, setMedName] = useState('');
  const [maker, setMakerName] = useState('');
  const [salt, setSaltName] = useState('');
  const [category, setCategory] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [expiry, setExpiry] = useState('');

  const excelData = useAppSelector(selectExcelData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excelData || !excelData.medicine) {
      alert('No Excel data found. Please upload the file first.');
      return;
    }
 
    const payload = {
      updatedData: excelData,  
      name,
      maker,
      salt,
      category,
      batchNo,
      expiry,
    };

    try {
      const response = await fetch('/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'updated_data.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert('Updated Excel file downloaded.');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update Excel file.');
      }
    } catch (error) {
      console.error('Error updating Excel file:', error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#252525]">
      <h1 className="text-3xl font-bold mb-4 text-white">Update Medicine Data</h1>

      <form onSubmit={handleSubmit} className="flex text-white flex-col gap-4">
        <input
          type="text"
          value={name}
          placeholder="Enter Medicine Name"
          onChange={(e) => setMedName(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="text"
          value={maker}
          placeholder="Enter Company"
          onChange={(e) => setMakerName(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="text"
          value={salt}
          placeholder="Enter Salt Name"
          onChange={(e) => setSaltName(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="text"
          value={category}
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="text"
          value={batchNo}
          placeholder="Batch No"
          onChange={(e) => setBatchNo(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="date"
          value={expiry}
          placeholder="Expiry Date"
          onChange={(e) => setExpiry(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </main>
  );
}

 