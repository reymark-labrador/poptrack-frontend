import axios from "@/services/axios"
import type { IProperty } from "@/types/property"

export const getDashboardProperties = async (): Promise<IProperty[]> => {
  const res = await axios.get("/dashboard/properties")
  return res.data.data // Assuming your API response is { data: [...] }
}
