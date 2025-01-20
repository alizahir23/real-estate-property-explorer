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
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract the query/filters from searchParams
  const query = (await searchParams).filters as string | undefined;

  return (
    <>
      <Navbar />
      <SearchFilterBar query={query} />
      <PropertyExplorer query={query} />
    </>
  );
}
