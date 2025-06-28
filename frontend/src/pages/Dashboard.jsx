import React, { useEffect, useState } from 'react';
import { Appbar } from '../components/Appbar';
import { Balance } from '../components/Balance';
import { Users } from '../components/Users';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3000/api/v1/user/me", {
      headers: { Authorization: "Bearer " + token }
    }).then(response => {
      setUserInfo(response.data.user);
    }).catch(() => {
      toast.error("Failed to load user info");
      navigate("/signin");
    });
  }, []);

  if (!userInfo) return null;

  return (
    <div>
      <ToastContainer />
      <Appbar
        name={`${userInfo.firstName}`}
        username={userInfo.username}
      />
      <div className="px-4 mt-4">
        <Balance value={userInfo.balance} />
        <button
          onClick={() => navigate('/transactions')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 mb-4"
        >
          View Transactions
        </button>
        <Users currentUserId={userInfo._id} />
      </div>
    </div>
  );
};

export default Dashboard;
