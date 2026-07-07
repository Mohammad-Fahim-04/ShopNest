const DEFAULT_API_URL = "https://shopnest-backend-2f6d.onrender.com";
export const API_BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

export const getApiUrl = (path) => `${API_BASE_URL}${path}`;
