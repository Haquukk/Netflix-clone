import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Succesfully create user account");
    } catch (error) {
      set({ isSigningUp: false, user: null });
      toast.error(error.response.data.messege || "Signup Failed");
      throw new Error(error);
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    console.log(credentials)
    try {
      const response = await axios.post("/api/v1/auth/signin", credentials);
      set({ user: response.data.user, isLoggingIn: false });
      toast.success("Succesfully Login");
    } catch (error) {
      set({ isLoggingIn: false, user: null });
      toast.error(error.response.data.messege || "login Failed");
      throw new Error(error);
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, isLoggingOut: false });
      toast.success("Logging Out Succesfully");
    } catch (error) {
      set({ isLoggingOut: false, user: null });
      toast.error(error.response.data.messege || "logout Failed");
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: false });
    try {
      const response = await axios.get("/api/v1/auth/me");
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ isCheckingAuth: false, user: null });
    }
  },
}));
