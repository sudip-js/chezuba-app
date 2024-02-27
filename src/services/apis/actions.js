import { apiClient } from "./axios";


export const fetchOrderLines = (params) => {
    return apiClient({
        method: 'GET',
        url: `/orderlines?${params}`,
    });
};