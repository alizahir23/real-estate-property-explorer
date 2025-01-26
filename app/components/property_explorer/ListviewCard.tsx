import React from "react";
import Image from "next/image";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Property } from "@/types/property";

const ListviewCard = ({ property }: { property: Property }) => {
  return (
    <li className="group hover:cursor-pointer hover:bg-[#10192a] rounded-md p-2 list-none my-1">
      <div className=" w-full h-[calc(15vw-24px)] relative rounded-lg overflow-hidden ">
        <Image
          src={
            "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
          unoptimized
          height={1}
          width={1}
          alt="property"
          className="object-cover w-full h-[calc(15vw-24px)] bg-gray-200"
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
        <p className="text-xl font-semibold text-white">
          {property.Property == "" ? "TBD" : property.Property}
        </p>
        <p className="text-gray-300">
          {property.Community}, {property.Subcommunity}, {property.City}
        </p>
      </div>
    </li>
  );
};

export default ListviewCard;
