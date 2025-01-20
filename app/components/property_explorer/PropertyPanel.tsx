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
        className="translate-x-4 border-gray-300 border-opacity-50 w-128 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-white shadow-lg rounded-md  overflow-auto"
      >
        <div className="relative rounded-t-lg overflow-hidden ">
          <Image
            src={
              "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            unoptimized
            height={180}
            width={360}
            alt="property"
            className="object-cover w-full h-[164px]"
          />
          <div className="absolute inset-0 flex justify-between ">
            <div className="bg-black/30 text-white m-2 px-2 py-1 rounded-md text-xs font-semibold self-start">
              Coming soon
            </div>
            <button className="self-start p-2 hover:bg-white/10 rounded-full transition-colors">
              <FontAwesomeIcon icon={faHeart} className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        <div className="mt-2 space-y-1 pb-2 px-2">
          <p className="text-l font-semibold">{property.Property}</p>
          <p className="text-gray-700 text-sm">
            {property.Subcommunity}, {property.Subcommunity}
          </p>
          <p className="text-gray-600 text-sm">{property.City}</p>
        </div>
      </div>
    );
  }
);

PropertyPanel.displayName = "PropertyPanel";

export default PropertyPanel;
