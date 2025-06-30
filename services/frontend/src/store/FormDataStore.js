import { create } from 'zustand';
import staysClient from '../api/staysClient';

// Mock data to use if API calls fail
const mockCategories = [
  { id: 1, name: 'Apartment', description: 'Modern urban living spaces', icon: 'building' },
  { id: 2, name: 'Villa', description: 'Luxury standalone houses', icon: 'home' },
  { id: 3, name: 'Resort', description: 'Full-service vacation properties', icon: 'palm-tree' },
  { id: 4, name: 'Cabin', description: 'Cozy woodland retreats', icon: 'trees' },
  { id: 5, name: 'Beach House', description: 'Properties with ocean access', icon: 'waves' }
];

const mockAmenities = [
  { id: 1, name: 'Wi-Fi', description: 'High-speed internet', icon: 'wifi', category: 'essentials' },
  { id: 2, name: 'Pool', description: 'Private swimming pool', icon: 'waves', category: 'outdoors' },
  { id: 3, name: 'Gym', description: 'Fitness equipment', icon: 'dumbbell', category: 'facilities' },
  { id: 4, name: 'Parking', description: 'Free parking on premises', icon: 'car', category: 'essentials' },
  { id: 5, name: 'Air Conditioning', description: 'Climate control', icon: 'wind', category: 'essentials' }
];

export const useFormDataStore = create((set) => ({
  categories: [],
  amenities: [],
  loading: false,
  error: null,
  
  fetchFormData: async () => {
    try {
      set({ loading: true, error: null });
      
      console.log("Fetching categories and amenities");
      
      // Fetch categories first
      try {
        const categoriesRes = await staysClient.get('/categories');
        console.log("Categories API response:", categoriesRes?.data);
        
        if (categoriesRes?.data?.data) {
          set(state => ({ 
            ...state,
            categories: categoriesRes.data.data 
          }));
        }
      } catch (categoryError) {
        console.error("Error fetching categories:", categoryError);
        console.log("Using mock categories as fallback");
        
        // Use mock data as fallback
        set(state => ({ 
          ...state,
          categories: mockCategories,
          error: "Using mock categories data. API connection failed."
        }));
      }
      
      // Then fetch amenities
      try {
        const amenitiesRes = await staysClient.get('/amenities');
        console.log("Amenities API response:", amenitiesRes?.data);
        
        if (amenitiesRes?.data?.data) {
          set(state => ({ 
            ...state,
            amenities: amenitiesRes.data.data,
            loading: false
          }));
        }
      } catch (amenityError) {
        console.error("Error fetching amenities:", amenityError);
        console.log("Using mock amenities as fallback");
        
        // Use mock data as fallback
        set(state => ({ 
          ...state, 
          amenities: mockAmenities,
          loading: false
        }));
      }
      
    } catch (error) {
      console.error('Error in fetchFormData:', error);
      
      // Use mock data as fallback for both
      set({ 
        categories: mockCategories,
        amenities: mockAmenities,
        error: 'Failed to load data from API. Using mock data instead.',
        loading: false 
      });
    }
  },
  
  resetFormData: () => set({
    categories: [],
    amenities: [],
    error: null
  })
}));