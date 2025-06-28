import React, { useState } from "react";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import Input from "../components/Input";
import Button from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const navigate = useNavigate();

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


  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/signup", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Signup successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <ToastContainer />
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <Input label="First Name" placeholder="Devansh" onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input label="Last Name" placeholder="Gupta" onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <Input label="Email" placeholder="devansh@gmail.com" onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <Input label="Password" placeholder="********" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div className="pt-4">
            <Button label={"Sign up"} onPress={handleSignup} />
          </div>
          <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
