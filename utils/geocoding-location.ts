import { Key } from "react";

type LocationData = {
  id: Key;
  City: string;
  Community: string;
  Subcommunity: string;
  Property: string;
};

const geocodeLocation = async (location: LocationData) => {
  // Use Google Geocoding API or another service
  const address = `${location.Property}, ${location.Subcommunity}, ${location.Community}, ${location.City}`;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=AIzaSyCuKLKXrJxnrM24zucIuMx6VIcXzjWONM8`
  );
  const data = await response.json();

  if (data.results.length > 0) {
    return data.results[0].geometry.location;
  }
  return null;
};
