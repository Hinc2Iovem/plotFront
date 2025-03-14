import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? `https://${import.meta.env.VITE_PROD_PORT}`
    : "http://localhost:3000";

console.log(BASE_URL);

export const axiosCustomized = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
