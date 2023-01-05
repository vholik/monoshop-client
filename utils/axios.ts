import { User } from "@store/types/user";
import axios from "axios";

const API_URL = "http://localhost:8000";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<User>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        return instance.request(originalRequest);
      } catch (e) {
        console.log("Is not authorized");
      }
    }
    throw error;
  }
);

export default instance;
