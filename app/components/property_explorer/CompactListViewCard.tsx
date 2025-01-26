// CompactListviewCard.tsx
import React from "react";
import Image from "next/image";
import { Property } from "@/types/property";

const CompactListviewCard = ({ property }: { property: Property }) => {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-[#10192a] rounded-md">
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          unoptimized
          src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt={property.Property || "Property Image"}
          layout="fill"
          objectFit="cover"
          className="rounded"
        />
      </div>

      <div className="flex flex-col flex-grow min-w-0">
        <h3 className="font-medium truncate">
          {property.Property === "" ? "TBD" : property.Property}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {property.Community}, {property.Subcommunity}, {property.City}
        </p>
      </div>
    </div>
  );
};

export default CompactListviewCard;
