import { useState } from "react"
import { HeroSection } from "./components/HeroSection"
import { properties } from "@/data/properties"
import { PropertyList } from "./components/PropertyList"
import { SearchFilters } from "./components/SearchFilters"
import type { Property } from "@/types/property"

export function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<
    Property["type"] | "All"
  >("House")

  const filterBySearch = (property: Property) => {
    return (
      searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const filterByCategory = (property: Property) => {
    return activeCategory === "All" || property.type === activeCategory
  }

  const filteredProperties = properties.filter(
    (property) => filterBySearch(property) && filterByCategory(property)
  )

  return (
    <>
      <HeroSection />
      <SearchFilters
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        onSearchChange={setSearchQuery}
        onCategoryChange={setActiveCategory}
      />
      <PropertyList properties={filteredProperties} />
    </>
  )
}
