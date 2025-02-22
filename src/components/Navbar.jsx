import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar bg-body-tertiary ">
      <div className="container flex items-center ">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center">
          <img src={logo} alt="Project Logo" className="h-10 w-10" />
        </button>

        {/* Navigation Buttons (Aligned beside logo) */}
        <div className="flex gap-6 text-gray-700">
          <button onClick={() => navigate("/dashboard")} className="hover:text-indigo-600 transition">
            Dashboard
          </button>
          <button onClick={() => navigate("/projects")} className="hover:text-indigo-600 transition">
            Projects
          </button>
          <button onClick={() => navigate("/tasks")} className="hover:text-indigo-600 transition">
            Tasks
          </button>
          <button onClick={() => navigate("/team")} className="hover:text-indigo-600 transition">
            Teams
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
