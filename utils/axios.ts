import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// instance.interceptors.request.use((config) => {
//   const localItem = localStorage.getItem("token") as string;

//   if (localItem) {
//     const token = JSON.parse(localItem).token;
//     config.headers!.Authorization = token ? `Bearer ${token}` : null;
//   }

//   return config;
// });

export default instance;
