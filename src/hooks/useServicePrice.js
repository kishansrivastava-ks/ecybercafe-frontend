import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

export const useServicePrice = (serviceType) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["publicServicePrices"], // Cache key
    queryFn: async () => {
      const res = await axiosInstance.get("/services/prices");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // Cache price for 5 minutes
  });

  // Find the specific price for the requested service type
  const serviceConfig = data?.find((s) => s.serviceType === serviceType);

  return {
    price: serviceConfig?.price,
    isLoading,
    isError,
  };
};
