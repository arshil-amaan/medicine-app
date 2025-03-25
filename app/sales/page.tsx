'use client';
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';

const PurchasePage = () => {
    const [medicineName, setMedicineName] = useState('');
    const [quantitySold, setQuantitySold] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [saleDate, setSaleDate] = useState('');
    const excelData = useAppSelector(selectExcelData);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excelData || !excelData.purchase) {
      alert('No Purchase data found. Please upload the file first.');
      return;
    }
  
    const payload = {
        updatedData: excelData,
        medicineName,
        quantitySold,
        salePrice,
        totalAmount,
        saleDate
    }

    try {
      const response = await fetch('/api/sales', {
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
    <main className="flex flex-col quantitySolds-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Sales Data</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={medicineName}
          placeholder="Enter medicineName Name"
          onChange={(e) => setMedicineName(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={quantitySold}
          placeholder="Enter quantitySold Name"
          onChange={(e) => setQuantitySold(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={salePrice}
          placeholder="Enter Quantity"
          onChange={(e) => setSalePrice(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={totalAmount}
          placeholder="Enter Price"
          onChange={(e) => setTotalAmount(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="date"
          value={saleDate}
          placeholder="Enter Date"
          onChange={(e) => setSaleDate(e.target.value)}
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
};

export default PurchasePage;