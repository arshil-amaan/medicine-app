"use client";

import { useState } from "react";
import { selectExcelData } from "@/lib/features/pharma/pharmaSlice";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DistributorPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    contact: "",
    gst: "",
    email: "",
    website: "",
  });

  // Redux se Excel data fetch karna
  const excelData = useAppSelector(selectExcelData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!excelData || !excelData.distributor) {
      alert("No Excel data found. Please upload the file first.");
      return;
    }

    const payload = {
      updatedData: excelData, // Redux se JSON data
      ...formData,
    };

    try {
      const response = await fetch("/api/distributor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "updated_distributors.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert("Distributor added successfully!");
        setFormData({
          name: "",
          company: "",
          contact: "",
          gst: "",
          email: "",
          website: "",
        });
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add distributor");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Distributor Management</h1>
          <p className="text-muted-foreground mt-2">Add and manage your product distributors</p>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="add">Add Distributor</TabsTrigger>
            <TabsTrigger value="manage">Manage Distributors</TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Distributor</CardTitle>
                <CardDescription>Enter distributor details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Basic Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Distributor Name <span className="text-red-500">*</span></Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="company">Company Name <span className="text-red-500">*</span></Label>
                          <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contact">Contact Number <span className="text-red-500">*</span></Label>
                          <Input id="contact" name="contact" value={formData.contact} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="gst">GST Number <span className="text-red-500">*</span></Label>
                          <Input id="gst" name="gst" value={formData.gst} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="w-full md:w-auto">Add Distributor</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Distributors</CardTitle>
                <CardDescription>View and manage your existing distributors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 border rounded-md">
                  <p className="text-muted-foreground">Distributor management interface will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
