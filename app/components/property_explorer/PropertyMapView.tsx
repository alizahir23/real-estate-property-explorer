"use client";
import React, { Key, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  Pin,
  ColorScheme,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Property } from "@/types/property";
import PropertyPanel from "./PropertyPanel";
import SearchFilterBar from "../SearchFilterBar";

type Poi = {
  key: Key;
  location: google.maps.LatLngLiteral;
  property: Property;
};

const PropertyMapView = ({
  mappedLocations,
  selectedProperty,
  onPropertySelect,
  query,
}: {
  mappedLocations: Poi[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
  query: string | undefined;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedProperty &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onPropertySelect(null);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [selectedProperty, panelRef, onPropertySelect]);

  return (
    <div className="relative w-full h-[calc(100vh-88px)]">
      <SearchFilterBar query={String(query)} />

      <APIProvider
        apiKey={apiKey ?? ""}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <Map
          defaultZoom={10}
          disableDefaultUI={true}
          mapId={"d6e2b2a6ed87d49c"}
          defaultCenter={{ lat: 25.2048, lng: 55.2708 }} // Dubai center
          colorScheme={ColorScheme.DARK}
        >
          <MapController
            locations={mappedLocations}
            selectedProperty={selectedProperty}
            onMarkerClick={onPropertySelect}
          />
        </Map>

        {selectedProperty && (
          <div className="">
            <PropertyPanel property={selectedProperty} ref={panelRef} />
          </div>
        )}
      </APIProvider>
    </div>
  );
};

const MapController = ({
  locations,
  selectedProperty,
  onMarkerClick,
}: {
  locations: Poi[];
  selectedProperty: Property | null;
  onMarkerClick: (property: Property) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || locations.length === 0) return;

    // Create bounds
    const bounds = new google.maps.LatLngBounds();
    locations.forEach((location) => {
      bounds.extend(new google.maps.LatLng(location.location));
    });

    // Adjust map to fit bounds with some padding
    map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });

    // If a property is selected, pan to its location
    if (selectedProperty) {
      const selectedLocation = locations.find(
        (loc) => loc.property.id === selectedProperty.id
      );
      if (selectedLocation) {
        map.panTo(selectedLocation.location);
      }
    }
  }, [map, locations, selectedProperty]);

  return (
    <PoiMarkers
      pois={locations}
      selectedProperty={selectedProperty}
      onMarkerClick={onMarkerClick}
    />
  );
};

const PoiMarkers = ({
  pois,
  selectedProperty,
  onMarkerClick,
}: {
  pois: Poi[];
  selectedProperty: Property | null;
  onMarkerClick: (property: Property) => void;
}) => {
  const map = useMap();

  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  const handleClick = (ev: google.maps.MapMouseEvent, poi: Poi) => {
    if (!map) return;
    if (!ev.latLng) return;
    map.panTo(ev.latLng);
    onMarkerClick(poi.property);
  };

  return (
    <>
      {pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          clickable={true}
          onClick={(ev) => handleClick(ev, poi)}
        >
          <Pin
            scale={selectedProperty?.id === poi.property.id ? 1 : 0.8}
            background={
              selectedProperty?.id === poi.property.id ? "#000" : "#fff"
            }
            glyphColor={
              selectedProperty?.id === poi.property.id ? "#fff" : "#000"
            }
            borderColor={
              selectedProperty?.id === poi.property.id ? "#fff" : "#000"
            }
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default PropertyMapView;
