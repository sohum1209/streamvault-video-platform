"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function LoginForm({ callbackUrl }) {
  const { user, LoginUser } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      await LoginUser(email, password);
      console.log(user);
      router.push(callbackUrl);
    } catch (error) {
      console.log("Error Encountered: ", error);
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <Image src="/bannerimage.jpg" fill alt="banner-img" />
        <div className="w-full h-full z-10 bg-black/50 fixed top-0"></div>

        <div className="flex justify-center items-center h-screen w-full">
          <div className="fixed z-50 w-[480px] h-[560px] bg-black/90 m-auto">
            <div className="max-w-[380px] mx-auto px-5 py-16">
              <h2 className="font-bold text-3xl">Login</h2>
              <form
                className="flex flex-col w-full h-full py-4"
                onSubmit={handlelogin}
              >
                <input
                  type="email"
                  placeholder="Email"
                  className="p-3 my-2 bg-gray-800"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="p-3 my-2 bg-gray-800"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full p-3 text-white bg-red-700 my-2"
                >
                  LogIn
                </button>
                <div className="flex justify-between items-center text-gray-600 text-sm my-1">
                  <p>
                    <input className="mr-2" type="checkbox" />
                    Remember Me
                  </p>
                  <p>Need Help?</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
