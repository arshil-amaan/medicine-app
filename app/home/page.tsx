"use client";
import Link from "next/link";
import React from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectExcelData } from '@/lib/features/pharma/pharmaSlice';

const Home = () => {
  const excelData = useAppSelector(selectExcelData);

  const handleShowData = () => {
    console.log(excelData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#252525]">
      <h1 className="text-xl font-semibold mb-4">Home Page</h1>
      <>
        <p className="text-gray-600 mb-4">Uploaded File</p>
        <div className="flex justify-center space-x-4">
          <Link className="bg-blue-500 text-white px-4 py-2 rounded" href={'/medicine'}>Medicine</Link>
          <Link className="bg-green-500 text-white px-4 py-2 rounded" href={'/distributer'}>Distributer</Link>
          <Link className="bg-purple-500 text-white px-4 py-2 rounded" href={'/purchase'}>Purchase</Link>
          <Link className="bg-purple-500 text-white px-4 py-2 rounded" href={'/upload'}>upload</Link>
          <Link className="bg-purple-500 text-white px-4 py-2 rounded" href={'/sales'}>Sales</Link>
        </div>
        <button onClick={handleShowData} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Show Store Data on Console</button>
      </>
    </div>
  );
};

export default Home;