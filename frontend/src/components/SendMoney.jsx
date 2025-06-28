// src/pages/SendMoney.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Heading from "../components/Heading";
import Input from "../components/Input";

export const SendMoney = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const name = queryParams.get("name");

  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token not found. Please sign in again.");
        navigate("/signin");
        return;
      }

      const payload = {
        to: String(id),
        amount: Number(amount),
      };

      const response = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Transfer successful");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Transfer failed");
      console.error("Transfer error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-md w-96">
        <Heading label={`Send Money to ${name}`} />
        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="pt-4">
          <button
            onClick={handleTransfer}
            disabled={loading || isNaN(Number(amount)) || Number(amount) <= 0}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 w-full"
          >
            {loading ? "Transferring..." : "Initiate Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
};
