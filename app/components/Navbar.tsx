"use client";
import React, { useState } from "react";
import Link from "next/link";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-[#0d1117]/95 fixed top-0 z-50 py-[12px]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main navbar */}
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 mr-8">
              <div className="text-white text-2xl font-semibold">Kendal</div>
            </Link>
          </div>
          {/* Center side */}
          <div>
            {" "}
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center text-lg space-x-8 font-light">
              <Link href="" className="text-white hover:text-gray-300">
                Home
              </Link>
              <Link href="" className="text-gray-400 hover:text-gray-300">
                About
              </Link>
              <Link href="" className="text-gray-400 hover:text-gray-300">
                Plans
              </Link>
              <Link href="" className="text-gray-400 hover:text-gray-300">
                Contact
              </Link>
            </div>
          </div>
          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href=""
              className="px-[20px] py-[12px] rounded-lg border bg-[#242424] border-[#2563EB] text-white hover:bg-gray-800 transition-colors"
            >
              Book A Demo
              <span className="ml-2">↗</span>
            </Link>
            <Link
              href=""
              className="px-[20px] py-[12px] rounded-lg border-[#adc7ff] bg-[#2563EB] text-white hover:bg-[#2d62d4] transition-colors"
            >
              Login
              <span className="ml-2">↗</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${isOpen ? "block" : "hidden"} md:hidden py-2 space-y-1`}
        >
          <Link
            href=""
            className="block px-2 py-2 text-white hover:text-gray-300"
          >
            Home
          </Link>
          <Link
            href=""
            className="block px-2 py-2 text-white hover:text-gray-300"
          >
            About
          </Link>
          <Link
            href=""
            className="block px-2 py-2 text-white hover:text-gray-300"
          >
            Plans
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
            Book A Demo
          </Link>
          <Link
            href=""
            className="block px-2 py-2 text-white hover:text-gray-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
