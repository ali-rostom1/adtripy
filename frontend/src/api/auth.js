import api from "./client";

export const login = (data) => api.post("/login", data);
export const register = (data) => api.post("/register", data);
// Add more auth endpoints as needed
