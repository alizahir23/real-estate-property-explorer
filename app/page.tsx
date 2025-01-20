import { Metadata } from "next";
import Navbar from "./components/Navbar";
import DynamicSearchPage from "./DynamicSearchPage";

export const metadata: Metadata = {
  title: "Real Estate Property Explorer",
  description: "Explore properties with interactive map and list views",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <DynamicSearchPage />
    </>
  );
}
