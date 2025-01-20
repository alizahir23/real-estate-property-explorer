// app/DynamicSearchPage.tsx
"use client";

import { useSearchParams } from "next/navigation";
import SearchFilterBar from "./components/SearchFilterBar";
import PropertyExplorer from "./components/property_explorer/PropertyExplorer";

export default function DynamicSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <>
      <SearchFilterBar query={query} />
      <PropertyExplorer query={query} />
    </>
  );
}
