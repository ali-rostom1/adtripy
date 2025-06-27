import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCarsStore } from "../../../store/CarsStore";
import ClassicNavbar from "../../../components/guest/Nav";

// DEBUG VERSION - minimal implementation to identify issues
export default function CarsPage() {
  console.log("CarsPage is rendering");
  
  // First check if store is available
  const carsStore = useCarsStore();
  console.log("Cars Store state:", carsStore);
  
  // Destructure cautiously with fallbacks
  const { 
    vehicles = [], 
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0 }, 
    fetchVehicles, 
    isLoading = false, 
    error = null 
  } = carsStore || {};
  
  const testApiConnection = async () => {
    try {
      const apiUrl = import.meta.env.VITE_CARS_API_URL;
      console.log("Testing API connection to:", apiUrl);
      
      const response = await fetch(`${apiUrl}/api/vehicles`);
      const data = await response.json();
      console.log("Direct API call result:", data);
      return data;
    } catch (err) {
      console.error("Error in direct API call:", err);
      return null;
    }
  };
  
  useEffect(() => {
    console.log("CarsPage useEffect running");
    testApiConnection();
    
    try {
      // Check if fetchVehicles exists before calling
      if (typeof fetchVehicles === 'function') {
        console.log("Calling fetchVehicles");
        fetchVehicles().catch(err => {
          console.error("Error in fetchVehicles:", err);
        });
      } else {
        console.error("fetchVehicles is not a function:", fetchVehicles);
      }
    } catch (err) {
      console.error("Exception in useEffect:", err);
    }
  }, []);
  
  // Return a simple UI
  return (
    <>
      <ClassicNavbar />
      <div className="min-h-screen bg-white pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Cars Page - Debug Mode</h1>
          
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Store Status:</h2>
            <ul className="list-disc ml-6">
              <li>isLoading: {isLoading ? "Yes" : "No"}</li>
              <li>Error: {error ? error : "None"}</li>
              <li>Vehicles count: {vehicles.length}</li>
              <li>Pagination: Page {pagination.currentPage} of {pagination.totalPages}</li>
            </ul>
          </div>
          
          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-green-600"></div>
              <p className="mt-4">Loading vehicles...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.length > 0 ? (
                vehicles.map(vehicle => (
                  <div key={vehicle.id} className="border p-4 rounded-lg">
                    <h3 className="font-bold">{vehicle.name}</h3>
                    <p>${vehicle.price}/day</p>
                    <Link to={`/cars/${vehicle.id}`} className="text-blue-600 hover:underline">
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center py-10">No vehicles found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}