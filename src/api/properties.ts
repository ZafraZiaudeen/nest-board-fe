import type { Property, PropertyDetail } from "@/types/property"

export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch("http://localhost:3001/api/properties")
  if (!res.ok) throw new Error("Failed to fetch properties")
  return res.json()
}

export async function fetchPropertyDetail(id: string): Promise<PropertyDetail> {
  const res = await fetch(`http://localhost:3001/api/properties/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch property: ${id}`)
  return res.json()
}

export async function createProperty(
  data: Omit<Property, "id" | "rating">,
): Promise<Property> {
  const res = await fetch("http://localhost:3001/api/properties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create property")
  return res.json()
}

export async function updateProperty(
  id: string,
  data: Partial<Property>,
): Promise<Property> {
  const res = await fetch(`http://localhost:3001/api/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update property")
  return res.json()
}

export async function deleteProperty(id: string): Promise<void> {
  const res = await fetch(`http://localhost:3001/api/properties/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete property")
}