'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthContextProvider } from "@/context/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <AuthContextProvider>
          <Provider store={store}>
            <ToastProvider>
              <Navbar />
              {children}
            </ToastProvider>
          </Provider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
