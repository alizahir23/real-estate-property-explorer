import { Property } from "@/types/property";
import { Key } from "react";

const geocodeLocation = async (location: Property) => {
  // Use Google Geocoding API or another service
  const address = `${location.Property}, ${location.Subcommunity}, ${location.Community}, ${location.City}`;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );
  const data = await response.json();

  if (data.results.length > 0) {
    return data.results[0].geometry.location;
  }
  return null;
};
