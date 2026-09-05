const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const normalizedBaseUrl = configuredBaseUrl.replace(/\/$/, "");

export const API_BASE_URL = normalizedBaseUrl.endsWith("/api")
	? normalizedBaseUrl
	: `${normalizedBaseUrl}/api`;