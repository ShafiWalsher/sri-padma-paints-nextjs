import { hideLoader, showLoader } from "@/store/loading-store";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const isDev = process.env.NODE_ENV === "development";

// --- TYPE DEFINITIONS ---
// Matches the backend response structure for success
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string | null;
}

// Matches the backend response structure for errors
interface ErrorResponse {
  success: false;
  error: string;
  details?: string | null;
}

// --- AXIOS INSTANCE ---
const axioInstance = axios.create({
  // Use environment variables for the base URL
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // IMPORTANT: This allows cookies to be sent with requests
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- AXIOS INTERCEPTORS ---

axioInstance.interceptors.request.use(
  (config) => {
    showLoader(); // Show the global loader

    // Set token from environment variable
    const token = process.env.NEXT_PUBLIC_API_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log only in development
    if (isDev) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${
          config.url
        }`
      );
      if (config.data) {
        console.log(`[Payload]`, config.data);
      }
    }

    return config;
  },
  (error) => {
    hideLoader(); // Hide loader on request error
    return Promise.reject(error);
  }
);

axioInstance.interceptors.response.use(
  // 1. OnFulfilled Interceptor (Handles SUCCESSFUL responses, status 2xx)
  (response) => {
    hideLoader();

    if (isDev) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }

    const data: SuccessResponse<unknown> = response.data;

    // If the response is a success and has a message, show a success toast
    if (data.success && data.message) {
      toast.success("Success", {
        description: data.message,
      });
    }

    // Return the original response to the calling function
    return response;
  },

  // 2. OnRejected Interceptor (Handles FAILED responses, status 3xx, 4xx, 5xx)
  (error: AxiosError) => {
    hideLoader();
    if (isDev) {
      console.error(`[API Error] ${error.config?.url}`, error);
    }

    let errorMessage = "A network or server error occurred.";

    // Case 1: The API returned a structured error (e.g., validation, auth)
    if (error.response && error.response.data) {
      const errorData = error.response.data as ErrorResponse;
      // Use the 'error' field from our standardized API error response
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    }
    // Case 2: Network error, CORS error, etc. (no response from server)
    // The default message will be used here.

    // Display the global error toast
    toast.error("Error", {
      description: errorMessage,
    });

    // IMPORTANT: Reject the promise so that components using the API call
    // can still handle the error in their .catch() block (e.g., stop a loading spinner)
    return Promise.reject(error);
  }
);

export default axioInstance;
