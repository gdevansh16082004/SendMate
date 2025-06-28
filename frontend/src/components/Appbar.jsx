import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut } from 'lucide-react';

export const Appbar = ({ name = "User" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out!");
    navigate("/signin");
  };

  return (
    <div className="shadow h-14 flex justify-between items-center px-4">
      <span
        className="font-bold text-xl cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        SendMate
      </span>
      <div className="flex items-center gap-3">
        <span>Hello, {name}</span>
        <div className="rounded-full h-10 w-10 bg-slate-300 flex items-center justify-center text-lg">
          {name[0]}
        </div>
        <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-base px-3 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
      >
        <LogOut size={16} />
      </button>
      </div>
    </div>
  );
};
