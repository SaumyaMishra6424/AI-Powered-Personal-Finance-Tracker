import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [budget, setBudget] = useState(localStorage.getItem("budget") || "");

  const saveBudget = () => {
    localStorage.setItem("budget", budget);
    alert("Monthly budget saved!");
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-100 px-4 py-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Profile & Settings
        </h1>

        {/* User info */}
        <div className="bg-[#111827] border border-gray-800 p-4 sm:p-5 rounded-xl mb-4 shadow">
          <p className="mb-2 break-words">
            <strong>Name:</strong> {user?.displayName || "User"}
          </p>
          <p className="break-words text-gray-400">
            <strong className="text-gray-200">Email:</strong> {user?.email}
          </p>
        </div>

        {/* Budget */}
        <div className="bg-[#111827] border border-gray-800 p-4 sm:p-5 rounded-xl mb-4 shadow">
          <h2 className="font-semibold mb-3">Monthly Budget</h2>
          <input
            type="number"
            placeholder="Enter budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-[#0B0F1A] border border-gray-700 p-3 rounded mb-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={saveBudget}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition"
          >
            Save Budget
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
