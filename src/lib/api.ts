import axios from "axios";

const API_BASE = import.meta.env.PUBLIC_API_BASE || "https://blog.cannian.space/api";

const api = axios.create({
	baseURL: API_BASE,
	timeout: 10000,
});

export default api;
