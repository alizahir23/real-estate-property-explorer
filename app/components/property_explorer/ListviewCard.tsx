import React from "react";
import Image from "next/image";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Property } from "@/types/property";

const ListviewCard = ({ property }: { property: Property }) => {
  return (
    <li className="group hover:cursor-pointer hover:bg-slate-100 rounded-md p-2 list-none">
      <div className="relative rounded-lg overflow-hidden ">
        <Image
          src={
            "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
          unoptimized
          height={180}
          width={360}
          alt="property"
          className="object-cover w-full h-[180px]"
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

      <div className="mt-2 space-y-1">
        <p className="text-xl font-semibold">{property.Property}</p>
        <p className="text-gray-700">
          {property.Community}, {property.Subcommunity}
        </p>
        <p className="text-gray-600 text-sm">{property.City}</p>
        <p className="text-gray-500 text-sm">MLS®: 25-484655</p>
      </div>
    </li>
  );
};

export default ListviewCard;
