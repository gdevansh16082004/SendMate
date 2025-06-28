import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';
import { BottomWarning } from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import Input from "../components/Input";
import SubHeading from "../components/SubHeading";
import { useEffect } from "react";

export const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/api/v1/check-auth', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        navigate('/dashboard');
      })
      .catch(() => {
        // Invalid or expired token
        localStorage.removeItem('token');
      });
    }
  }, [navigate]);

  const handleSignin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
        username: email,
        password: password
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Invalid credentials");
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <ToastContainer />
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <Input
            placeholder="devansh@gmail.com"
            label={"Email"}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="123456"
            label={"Password"}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="pt-4">
            <Button label={"Sign in"} onPress={handleSignin} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  );
};
