import type { RoomType, Property } from "@/types/property"
import { apiFetch } from "./client"

export type CreatePropertyInput = {
  title: string
  description: string
  address: string
  city: string
  type: "HOUSE" | "VILLA" | "APARTMENT" | "HOTEL"
  rating: number
  amenities?: string[]
  latitude?: number
  longitude?: number
  imageUrl?: string
  minStay?: string
}

export async function fetchProperties() {
  return apiFetch<Property[]>("/properties/mine", { auth: true })
}

export async function createProperty(input: CreatePropertyInput) {
  return apiFetch<Property>("/properties", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  })
}

export async function deleteProperty(id: string) {
  return apiFetch<void>(`/properties/${id}`, {
    method: "DELETE",
    auth: true,
  })
}

export async function updateProperty(id: string, input: Partial<CreatePropertyInput>) {
  return apiFetch<Property>(`/properties/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(input),
  })
}

type CreateRoomTypeInput = {
  name: string
  pricePerMonth: number
  seatCapacity: number
  hasAC: boolean
  amenities?: string[]
}

export async function createRoomType(
  propertyId: string,
  input: CreateRoomTypeInput
) {
  return apiFetch<RoomType>(`/properties/${propertyId}/room-types`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  })
}

export async function deleteRoomType(propertyId: string, roomTypeId: string) {
  return apiFetch<void>(`/properties/${propertyId}/room-types/${roomTypeId}`, {
    method: "DELETE",
    auth: true,
  })
}

type CreateRoomInput = {
  roomLabel: string
}

export async function createRoom(
  propertyId: string,
  roomTypeId: string,
  input: CreateRoomInput
) {
  return apiFetch<RoomType>(
    `/properties/${propertyId}/room-types/${roomTypeId}/rooms`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(input),
    }
  )
}

export async function deleteRoom(
  propertyId: string,
  roomTypeId: string,
  roomId: string
) {
  return apiFetch<void>(
    `/properties/${propertyId}/room-types/${roomTypeId}/rooms/${roomId}`,
    {
      method: "DELETE",
      auth: true,
    }
  )
}

type UpdateRoomTypeInput = Partial<{
  name: string
  pricePerMonth: number
  seatCapacity: number
  hasAC: boolean
  amenities: string[]
}>

export async function updateRoomType(
  propertyId: string,
  roomTypeId: string,
  input: UpdateRoomTypeInput
) {
  return apiFetch<RoomType>(`/properties/${propertyId}/room-types/${roomTypeId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(input),
  })
}