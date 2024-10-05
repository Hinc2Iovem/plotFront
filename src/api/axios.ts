import axios from "axios";

const BASE_URL =
  import.meta.env.NODE_ENV === "production"
    ? import.meta.env.PROD_PORT
    : "http://localhost:3500";

export const axiosCustomized = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
