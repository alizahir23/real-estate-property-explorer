import React from "react";
import Image from "next/image";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Property } from "@/types/property";

const LoadingListviewCard = ({ key }: { key: number }) => {
  return (
    <li className="group hover:cursor-pointer hover:bg-slate-100 rounded-md p-2 list-none">
      <div className=" rounded-lg overflow-hidden ">
        <div className="object-cover w-full h-[180px] bg-gray-200" />
      </div>

      <div className="mt-2 space-y-1">
        <div className="object-cover  h-[16px] w-1/3 rounded-md  bg-gray-200" />
        <div className="object-cover w-3/4 h-[12px] rounded-md bg-gray-200" />
        <div className="object-cover w-3/4 h-[12px] rounded-md bg-gray-200" />
      </div>
    </li>
  );
};

export default LoadingListviewCard;
