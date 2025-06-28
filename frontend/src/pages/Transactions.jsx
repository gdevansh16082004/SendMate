import React, { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { ToastContainer, toast } from "react-toastify";

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const limit = 5;

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://sendmate-backend.onrender.com/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
      console.log("User:", response.data.user);
    } catch (err) {
      toast.error("Failed to fetch user info");
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://sendmate-backend.onrender.com/api/v1/transactions/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          page,
          limit,
        },
      });

      const seen = new Set();
      const uniqueTransactions = response.data.transactions.filter((txn) => {
        const key = `${txn.fromUserId}-${txn.toUserId}-${txn.amount}-${txn.timestamp}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setTransactions(uniqueTransactions);
      setTotal(response.data.total);
      console.log("Raw transactions:", response.data.transactions);
    } catch (err) {
      toast.error("Failed to load transactions");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchHistory();
  }, [search, page, user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <Appbar
      name={user?.firstName}
      />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Transaction History</h2>

        <input
          type="text"
          placeholder="Search by name..."
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions yet</p>
        ) : (
          <ul className="space-y-4">
            {transactions.map((txn, idx) => {
              const isDebit = txn.fromUserId === user?._id;
              const otherUser = isDebit ? txn.toUserDetails : txn.fromUserDetails;
              const name = otherUser?.firstName + " " + otherUser?.lastName;
              const userInitial = otherUser?.firstName?.charAt(0).toUpperCase() || "U";

              return (
                <li
                  key={txn._id || idx}
                  className={`flex justify-between items-center p-4 rounded-lg shadow-md ${
                    isDebit
                      ? "bg-red-100 border-l-4 border-red-500"
                      : "bg-green-100 border-l-4 border-green-500"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="rounded-full h-10 w-10 bg-white text-gray-800 flex items-center justify-center text-sm font-bold mr-3">
                      {userInitial}
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {isDebit ? `Sent to ${name}` : `Received from ${name}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(txn.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      isDebit ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ₹{txn.amount}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="text-gray-700">Page {page}</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
