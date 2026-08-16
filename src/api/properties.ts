import type { Property, PropertyDetail } from "@/types/property"
import { apiFetch } from "./client"

export async function fetchProperties(): Promise<Property[]> {
  return (await apiFetch<{ data: Property[] }>("/properties")).data
}

export async function fetchMyFavourites(): Promise<Property[]> {
  return apiFetch<Property[]>("/properties/my-favourites", { auth: true })
}

export async function toggleFavourite(
  propertyId: string,
): Promise<{ propertyId: string; isFavorite: boolean }> {
  return apiFetch<{ propertyId: string; isFavorite: boolean }>(
    `/properties/${propertyId}/toggle-favorite`,
    { method: "PATCH", auth: true },
  )
}
export async function fetchPropertyDetail(id: string): Promise<PropertyDetail> {
  return apiFetch<PropertyDetail>(`/properties/${id}`)
}

export async function createProperty(
  data: Omit<Property, "id" | "rating">,
): Promise<Property> {
  return (await apiFetch<{ data: Property }>("/properties", {
    method: "POST",
    body: JSON.stringify(data),
  })).data
}

export async function updateProperty(
  id: string,
  data: Partial<Property>,
): Promise<Property> {
  return (await apiFetch<{ data: Property }>(`/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })).data
}

export async function deleteProperty(id: string): Promise<void> {
  await apiFetch(`/properties/${id}`, {
    method: "DELETE",
  })
}