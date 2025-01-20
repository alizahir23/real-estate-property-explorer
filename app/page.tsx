import Navbar from "./components/Navbar";
import SearchFilterBar from "./components/SearchFilterBar";
import PropertyExplorer from "./components/property_explorer/PropertyExplorer";

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = (await searchParams).query;

  return (
    <>
      <Navbar />
      <SearchFilterBar query={query} />
      <PropertyExplorer query={query} />
    </>
  );
}
