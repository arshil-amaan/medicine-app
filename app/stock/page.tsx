'use client';
import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';

const PurchasePage = () => {
    const [medicineID, setMedicineID] = useState<any>(''); 
    const [stockQuantity, setStockQuantity] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const excelData = useAppSelector(selectExcelData);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!excelData || !excelData.purchase) {
      alert('No Purchase data found. Please upload the file first.');
      return;
    }
  
    const payload = {
        updatedData: excelData,
        medicineID,
        medicineName:excelData.medicine[medicineID-1].Name,
        stockQuantity,
        salePrice,
        purchasePrice,
        expiryDate
    }

    try {
      const response = await fetch('/api/stock', {
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
    <main className="flex flex-col stockQuantitys-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Stocks Data</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          value={medicineID}
          placeholder="Enter medicine ID"
          onChange={(e) => setMedicineID(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={stockQuantity}
          placeholder="Enter stock Quantity"
          onChange={(e) => setStockQuantity(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={purchasePrice}
          placeholder="Enter Purchase Price"
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="number"
          value={salePrice}
          placeholder="Enter Sale Price"
          onChange={(e) => setSalePrice(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="date"
          value={expiryDate}
          placeholder="Enter Expiry Date"
          onChange={(e) => setExpiryDate(e.target.value)}
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