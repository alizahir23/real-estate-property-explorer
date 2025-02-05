import React, { forwardRef } from "react";
import Image from "next/image";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Property } from "@/types/property";

const PropertyPanel = forwardRef<HTMLDivElement, { property: Property }>(
  ({ property }, ref) => {
    return (
      <div
        ref={ref}
        className="translate-x-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-4 w-72 rounded-xl overflow-hidden"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="bg-black/30 shadow-xl border border-white/10">
          {/* Image Container */}
          <div className="relative w-full h-48">
            <Image
              src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt={property.Property ?? "TBD"}
              className="object-cover"
              fill
              unoptimized
            />

            {/* Top badges and buttons */}
            <div className="absolute top-0 w-full p-3 flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                <span className="text-white text-xs font-medium">
                  {property.City}
                </span>
              </div>
              <button className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-full hover:bg-white/20 transition-colors">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="h-4 w-4 text-white"
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 bg-black/40">
            <h3 className="text-white text-lg font-semibold">
              {property.Property}
            </h3>
            <p className="text-gray-300 text-sm">
              {property.Subcommunity}, {property.Community}
            </p>

            {/* Price */}
            <div className="my-4">
              <span className="text-white text-xl font-bold">
                ${property.price.toLocaleString()}
              </span>
            </div>

            {/* View Button */}
            <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors backdrop-blur-sm font-medium">
              VIEW
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PropertyPanel.displayName = "PropertyPanel";

export default PropertyPanel;
