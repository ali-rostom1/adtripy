import { create } from "zustand";
import {
  getVehicles,
  getVehicleById,
  createVehicle as createVehicleApi,
  updateVehicle as updateVehicleApi,
  deleteVehicle as deleteVehicleApi,
} from "../api/cars";

export const useCarsStore = create((set, get) => {
  console.log("Creating cars store");
  
  return {
    vehicles: [],
    currentVehicle: null,
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },

    // Fetch all vehicles with pagination
    fetchVehicles: async (page = 1, filters = {}) => {
      console.log("fetchVehicles called with page:", page, "filters:", filters);
      set({ isLoading: true, error: null });
      
      try {
        console.log("Making API call to get vehicles");
        const response = await getVehicles(page, filters);
        console.log("Vehicles API response:", response);
        
        // Make sure we're getting data in the expected format
        if (response?.data?.data) {
          console.log("Found", response.data.data.length, "vehicles");
          set({
            vehicles: response.data.data,
            pagination: {
              currentPage: response.data.current_page || 1,
              totalPages: response.data.last_page || 1,
              totalItems: response.data.total || 0,
            },
            isLoading: false,
          });
          return response.data;
        } else {
          console.error("Unexpected API response format:", response);
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error in fetchVehicles:", error);
        set({
          isLoading: false,
          error: error.response?.data?.message || error.message || "Failed to fetch vehicles",
        });
        throw error;
      }
    },

    // Fetch a single vehicle by ID
    fetchVehicleById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await getVehicleById(id);
        set({ currentVehicle: response.data, isLoading: false });
        return response.data;
      } catch (error) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to fetch vehicle details",
        });
        throw error;
      }
    },

    // Create a new vehicle
    createVehicle: async (vehicleData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await createVehicleApi(vehicleData);
        set((state) => ({
          vehicles: [response.data, ...state.vehicles],
          isLoading: false,
        }));
        return response.data;
      } catch (error) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to create vehicle",
        });
        throw error;
      }
    },

    // Update an existing vehicle
    updateVehicle: async (id, vehicleData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await updateVehicleApi(id, vehicleData);
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) => 
            vehicle.id === id ? response.data : vehicle
          ),
          currentVehicle: state.currentVehicle?.id === id ? response.data : state.currentVehicle,
          isLoading: false,
        }));
        return response.data;
      } catch (error) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to update vehicle",
        });
        throw error;
      }
    },

    // Delete a vehicle
    deleteVehicle: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await deleteVehicleApi(id);
        set((state) => ({
          vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
          currentVehicle: state.currentVehicle?.id === id ? null : state.currentVehicle,
          isLoading: false,
        }));
        return true;
      } catch (error) {
        set({
          isLoading: false,
          error: error.response?.data?.message || "Failed to delete vehicle",
        });
        throw error;
      }
    },

    // Clear current vehicle
    clearCurrentVehicle: () => set({ currentVehicle: null }),

    // Clear errors
    clearError: () => set({ error: null }),
  };
});