import { apiClient, handleApiError } from "@/apis";
import { PaginatedResults } from "@/common/types";
import { useQuery } from "@tanstack/react-query";
import { Material } from "../../types";

interface Filter {
  classroom: string;
}

export const useMaterials = (filter?: Partial<Filter>) => {
  const materialsQuery = useQuery({
    enabled: true,
    queryKey: ["materials"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/materials", { params: filter });
        return res.data as PaginatedResults<Material>;
      } catch (err) {
        throw new Error(handleApiError(err).message);
      }
    },
  });

  return {
    materials: materialsQuery.data?.data ?? [],
    isLoading: materialsQuery.isPending,
    isError: materialsQuery.isError,
    error: materialsQuery.error,
  };
};
