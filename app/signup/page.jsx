'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function SignUp() {
  const { user, SignUpUser } = UserAuth()
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (!nameRegex.test(name)) {
      errors.name = "Invalid name";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email";
    }

    if (!phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!phoneRegex.test(phone)) {
      errors.phone = "Invalid phone number";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      errors.password = "Password is too weak";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please retype your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Retype the same password"
    }

    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) {
      return;
    }

    try {
      await SignUpUser(email, password, name, phone);
      router.push('/login')
    } catch (error) {
      console.log("Error Encountered: ", error)
    }
  }

  return (
    <>
      <div className="w-full h-full">
        <Image src="/bannerimage.jpg" fill alt="banner-img" />
        <div className="w-full h-full z-10 bg-black/50 fixed top-0"></div>

        {/* SignUp Form */}
        <div className="flex justify-center items-center h-screen w-full">
          <div className="fixed z-50 w-[480px] h-[560px] bg-black/90 m-auto">
            <div className="max-w-[380px] mx-auto px-5 py-16">
              <h2 className="font-bold text-3xl">Sign Up</h2>
              <form className="flex flex-col w-full h-full py-4" onSubmit={handleSignUp}>
                <input
                  type="text"
                  name="Name"
                  placeholder="Name"
                  className="p-3 my-2 bg-gray-800"
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  className="p-3 my-2 bg-gray-800"
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="p-3 my-2 bg-gray-800"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="p-3 my-2 bg-gray-800"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="p-3 my-2 bg-gray-800"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                <button
                  type="sumbit"
                  className="w-full p-3 text-white bg-red-700 my-2"
                >
                  SignUp
                </button>
                <div className="flex justify-between items-center text-gray-600 text-sm my-1">
                  <p>
                    <input className="mr-2" type="checkbox" />
                    Remember Me
                  </p>
                  <p>Need Help?</p>
                </div>
                <div className="text-gray-600 text-sm my-1">Already a member? <Link href="/login">Login</Link></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
