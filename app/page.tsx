import { Metadata } from "next";
import Navbar from "./components/Navbar";
import PropertyExplorer from "./components/property_explorer/PropertyExplorer";
import SearchFilterBar from "./components/SearchFilterBar";
import { use } from "react";

export const metadata: Metadata = {
  title: "Real Estate Property Explorer",
  description: "Explore properties with interactive map and list views",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function Page({ searchParams }: Props) {
  // Extract the query/filters from searchParams
  const query = use(searchParams).query ?? "";

  return (
    <>
      <Navbar />
      <SearchFilterBar query={String(query)} />
      <PropertyExplorer query={String(query)} />
    </>
  );
}
