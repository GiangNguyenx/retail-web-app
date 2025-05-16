import React, { useState } from "react";
import { Logo3, cart, usericon } from "../assets";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const productData = useSelector((state) => state.bazar.productData);
  const userInfo = useSelector((store) => store.bazar.userInfo);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="w-full bg-white border-b-[1px] border-b-gray-800 font-titleFont sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <div>
              <img className="w-20" src={Logo3} alt="logoDark" />
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              <Link to="/">
                <li className="text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300">
                  Home
                </li>
              </Link>
              <Link to="/shop">
                <li className="text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300">
                  Shop
                </li>
              </Link>
              <Link to="/contact">
                <li className="text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300">
                  Contact
                </li>
              </Link>
            </ul>

            {/* Cart */}
            <Link to="/cart">
              <div className="relative group">
                <img
                  className="w-10 transition-transform group-hover:scale-110"
                  src={cart}
                  alt="cart"
                />
                {productData.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-semibold animate-bounce">
                    {productData.length}
                  </span>
                )}
              </div>
            </Link>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <img
                  className="w-10 rounded-full"
                  src={userInfo ? userInfo.image : usericon}
                  alt="userlogo"
                />
                {userInfo && (
                  <span className="text-sm font-medium">{userInfo.name}</span>
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiUser className="inline mr-2" /> Profile
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    <FiLogOut className="inline mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-2xl" onClick={toggleMenu}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="mb-4">
              <SearchBar />
            </div>
            <ul className="space-y-4">
              <Link to="/">
                <li className="text-base text-black font-bold hover:text-orange-900">
                  Home
                </li>
              </Link>
              <Link to="/shop">
                <li className="text-base text-black font-bold hover:text-orange-900">
                  Shop
                </li>
              </Link>
              <Link to="/contact">
                <li className="text-base text-black font-bold hover:text-orange-900">
                  Contact
                </li>
              </Link>
              <Link to="/cart">
                <li className="text-base text-black font-bold hover:text-orange-900 flex items-center gap-2">
                  Cart
                  {productData.length > 0 && (
                    <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs">
                      {productData.length}
                    </span>
                  )}
                </li>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
