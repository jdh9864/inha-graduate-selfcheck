import axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://www.inhagraduationserver.shop/",
    withCredentials: true, // 세션/쿠키 가능성 고려
});

// 필요 시 토큰 주입
// http.interceptors.request.use((cfg) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });
