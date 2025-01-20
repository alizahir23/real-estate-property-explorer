import { Metadata } from "next";
import Navbar from "./components/Navbar";

import PropertyExplorer from "./components/property_explorer/PropertyExplorer";
import SearchFilterBar from "./components/SearchFilterBar";

export const metadata: Metadata = {
  title: "Real Estate Property Explorer",
  description: "Explore properties with interactive map and list views",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).filters;
  return (
    <>
      <Navbar />
      <SearchFilterBar query={query} />
      <PropertyExplorer query={query} />
    </>
  );
}
