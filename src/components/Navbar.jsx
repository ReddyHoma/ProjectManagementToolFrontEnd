import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar bg-body-tertiary ">
      <div className="container d-flex mx-auto ">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="d-flex align-items-center">
          <img src={logo} alt="Project Logo" className="h-10 w-10" />
        </button>

        {/* Navigation Buttons (Aligned beside logo) */}
        <div className="flex gap-8 text-gray-500  text-lg">
          <button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600 transition text-shadow-sm">
            Dashboard
          </button>
          <button onClick={() => navigate("/projects")} className="hover:text-indigo-600 transition text-shadow-sm">
            Projects
          </button>
          <button onClick={() => navigate("/tasks")} className="hover:text-indigo-600 transition text-shadow-sm">
            Tasks
          </button>
          <button onClick={() => navigate("/team")} className="hover:text-indigo-600 transition text-shadow-sm">
            Teams
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
