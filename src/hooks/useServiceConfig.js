import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

export const useServiceConfig = (serviceType) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["publicServiceConfigs"], // Renamed key
    queryFn: async () => {
      const res = await axiosInstance.get("/services/prices"); // Endpoint stays same
      return res.data;
    },
    staleTime: 5, // 2 minutes cache
  });

  const config = data?.find((s) => s.serviceType === serviceType);

  return {
    price: config?.price || 0,
    isActive: config?.isActive ?? true, // Default to true if loading or missing
    label: config?.label,
    isLoading,
    isError,
  };
};
