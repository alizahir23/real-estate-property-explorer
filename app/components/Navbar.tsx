"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  faBars,
  faChevronDown,
  faHamburger,
  faRulerHorizontal,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-black fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main navbar */}
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-light italic text-white hover:text-gray-300 mr-4"
            >
              Jade mills
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href=""
                className="flex items-center text-white hover:text-gray-300"
              >
                Our Properties
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="ml-2 h-3 w-3"
                />
              </Link>
              <Link href="" className="text-white hover:text-gray-300">
                Contact
              </Link>
              <Link href="" className="text-white hover:text-gray-300">
                310.285.7508
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Saved button - visible on desktop */}
            <div className="hidden md:flex items-center space-x-2 text-white hover:text-gray-300 cursor-pointer">
              <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
              <span>Saved</span>
            </div>

            {/* Mobile icons */}
            <div className="flex items-center space-x-4">
              <div className="md:hidden flex items-center text-white hover:text-gray-300">
                <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
              </div>

              {/* Hamburger menu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-white hover:text-gray-300"
              >
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
              </button>

              <button className="text-white hover:text-gray-300">
                <FontAwesomeIcon icon={faUserCircle} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden py-2 space-y-1 z-[60]`}
        >
          <Link
            href=""
            className="block px-2 py-2 text-white hover:text-gray-300"
          >
            Our Properties
          </Link>
          <Link
            href=""
            className="block px-2 py-2 text-white hover:text-gray-300"
          >
            Contact
          </Link>
          <Link
            href=""
            className="block px-2 py-2 text-white hover:text-gray-300"
          >
            310.285.7508
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
