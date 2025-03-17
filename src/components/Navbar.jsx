import React from "react";
import { useNavigate } from "react-router-dom";
import flowtrack from "../assets/flowtrack.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar bg-body-tertiary ">
      <div className="container d-flex mx-auto ">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="d-flex align-items-center">
          <img src={flowtrack} alt="Project Logo" className="h-10 w-30" />
        </button>

        {/* Navigation Buttons (Aligned beside logo) */}
        <div className="flex gap-6">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Projects", path: "/projects" },
            { name: "Tasks", path: "/tasks" },
            { name: "Teams", path: "/members" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative px-4 py-2 text-gray-700 font-medium transition-all duration-200 
                          hover:text-indigo-600 after:absolute after:bottom-[-2px] after:left-1/2 
                          after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all after:duration-300 
                          hover:after:w-full hover:after:left-0`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
