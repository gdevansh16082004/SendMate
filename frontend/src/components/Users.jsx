import React, { useState, useEffect } from "react";
import Button from "./Button";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const base64Url = token.split('.')[1];
    const decodedData = JSON.parse(atob(base64Url));
    setCurrentUserId(decodedData.userId);

    axios.get('https://sendmate-backend.onrender.com/api/v1/user/bulk?filter=' + filter, {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(response => {
      const filteredUsers = response.data.users.filter(user => user._id !== decodedData.userId);
      setUsers(filteredUsers);
    });
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-3 py-2 border rounded-md border-slate-300 shadow-sm"
        />
      </div>
      <div className="space-y-3">
        {users.map(user => <User key={user._id} user={user} />)}
      </div>
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex items-center">
        <div className="rounded-full h-10 w-10 bg-slate-200 flex items-center justify-center text-xl font-medium mr-3">
          {user.firstName[0].toUpperCase()}
        </div>
        <div>
          <div className="font-medium">{user.firstName} {user.lastName}</div>
          <div className="text-sm text-gray-500">{user.username}</div>
        </div>
      </div>
      <Button
        label={"Send Money"}
        onPress={() => navigate("/send?id=" + user._id + "&name=" + user.firstName)}
      />
    </div>
  );
}
