import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userOptionsOn, setUserOptionsOn] = useState(false);
  return (
    <div className="w-full my-3 md:mt-8 flex flex-col md:flex-row items-center justify-center sticky">
      <div className="border-2 md:flex flex-col md:flex-row py-3 md:px-8 rounded-lg md:rounded-full border-violet-400 w-full md:w-max md:gap-48 md:gap-48 items-center md:pr-10">
        <div className="w-full flex items-center justify-around">
          <h1 className="font-bold text-2xl">Recipe Finder</h1>
          {navbarOpen ? (
            <IoClose
              className="md:hidden hover:animate-pulse"
              fontSize={30}
              onClick={() => setNavbarOpen(!navbarOpen)}
            />
          ) : (
            <IoMenu
              className="md:hidden hover:animate-pulse"
              fontSize={30}
              onClick={() => setNavbarOpen(!navbarOpen)}
            />
          )}
        </div>
        {navbarOpen ? (
          <hr className="w-[75%] mx-auto my-4 md:hidden flex justify-center" />
        ) : null}
        <div
          className={`${
            navbarOpen ? "flex" : "hidden"
          } md:flex flex-col pb-3 md:pb-0 md:flex-row  gap-5`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-bold scale-110 transition-all duration-400 ease-in-out text-violet-600 hover:text-violet-600"
                : "hover:scale-110 hover:text-violet-600 transition-all duration-400 ease-in-out"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              isActive
                ? "font-bold scale-110 transition-all duration-400 ease-in-out text-violet-600 hover:text-violet-600"
                : "hover:scale-110 hover:text-violet-600 transition-all duration-400 ease-in-out"
            }
          >
            Recipes
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "font-bold scale-110 transition-all duration-00 ease-in-out text-violet-600 hover:text-violet-600"
                : "hover:scale-110 hover:text-violet-600 transition-all duration-400 ease-in-out"
            }
          >
            Contact
          </NavLink>
          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "font-bold scale-110 transition-all duration-00 ease-in-out text-violet-600 hover:text-violet-600"
                  : "hover:scale-110 hover:text-violet-600 transition-all duration-400 ease-in-out"
              }
            >
              Login
            </NavLink>
          ) : (
            <div className="flex relative justify-center">
              <div className="flex justify-center border-2 w-max items-center font-bold gap-1 hover:text-violet-600  px-2 rounded-lg" onClick={()=> setUserMenuOpen(!userMenuOpen)}>
                {user} {userMenuOpen ? <FaCaretUp /> : <FaCaretDown />}
              </div>
              {userMenuOpen ? <div className="absolute left-[42%] top-8 md:left-0 border-2 flex flex-col gap-2 w-max rounded-md p-4 bg-neutral-900">
                <NavLink to='/account' onClick={()=>setUserMenuOpen(!userMenuOpen)} className='hover:scale-110 hover:text-violet-600 transition-all duration-400'>Account</NavLink>
                <hr className="w-full mx-auto flex justify-center" />
                <NavLink to='saved-recipes' onClick={()=>setUserMenuOpen(!userMenuOpen)} className='hover:scale-110 hover:text-violet-600 transition-all duration-400'>Saved Recipes</NavLink>
                <hr className="w-full mx-auto flex justify-center" />
                <NavLink to='logout' onClick={()=>setUserMenuOpen(!userMenuOpen)} className='hover:scale-110 hover:text-red-500 transition-all duration-400'>Logout</NavLink>
              </div> : null}
            </div>
          )}
        </div>
      </div>
      {/* <div className='relative'>
            <div className='relative left-60 w-[60px] h-[60px] bg-red-200 rounded-full'></div>
        </div> */}
    </div>
  );
};

export default Navbar;
