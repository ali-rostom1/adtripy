import axios from "axios";
import { create } from "zustand";
import { useAuthStore } from "./AuthStore";
import {
  getStays,
  getStayById,
  updateStay as updateStayApi,
  deleteStay as deleteStayApi,
} from "../api/stays";

export const useStaysStore = create((set, get) => ({
  stays: [],
  currentStay: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },

  // Fetch all stays with pagination
  fetchStays: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getStays(page);
      set({
        stays: response.data.data,
        pagination: {
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
        },
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch stays",
      });
      throw error;
    }
  },

  // Fetch a single stay by ID
  fetchStayById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getStayById(id);
      set({ currentStay: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch stay details",
      });
      throw error;
    }
  },

  // Create a new stay
  createStay: async (stayData) => {
    try {
      // Get the token from auth store
      const token = useAuthStore.getState().token;

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_STAYS_API_URL}/api/stays`,
        stayData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      set((state) => ({
        stays: [response.data, ...state.stays],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create stay",
      });
      throw error;
    }
  },

  // Update an existing stay
  updateStay: async (id, stayData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateStayApi(id, stayData);
      set((state) => ({
        stays: state.stays.map((stay) =>
          stay.id === id ? response.data : stay
        ),
        currentStay: state.currentStay?.id === id ? response.data : state.currentStay,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to update stay",
      });
      throw error;
    }
  },

  // Delete a stay
  deleteStay: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteStayApi(id);
      set((state) => ({
        stays: state.stays.filter((stay) => stay.id !== id),
        currentStay: state.currentStay?.id === id ? null : state.currentStay,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete stay",
      });
      throw error;
    }
  },

  // Clear current stay
  clearCurrentStay: () => set({ currentStay: null }),

  // Clear errors
  clearError: () => set({ error: null }),
}));