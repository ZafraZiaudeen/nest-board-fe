import { HeroSection } from "./components/HeroSection"
import { properties } from "@/data/properties"
import { PropertyList } from "./components/PropertyList"
import { SearchFilters } from "./components/SearchFilters"
export function Home() {
  return (
    <>
      <HeroSection />
      <SearchFilters />
      <PropertyList properties={properties} />
    </>
  )
}
