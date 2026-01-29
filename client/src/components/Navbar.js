"use client";
import { useState, useEffect } from "react";
import { getCurrentUser, signOut, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import "@/lib/amplify-config";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAttributes, setUserAttributes] = useState(null);
  const router = useRouter();

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
      }
    } catch (err) {
      setUser(null);
      setUserAttributes(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
    const listener = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          checkUser();
          break;
        case "signedOut":
          setUser(null);
          setUserAttributes(null);
          break;
      }
    });
    return () => listener();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <nav className="w-full bg-black border-b border-gray-800 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo - Updated for black background */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tighter text-white">
            DIGITAL<span className="font-light text-gray-300">VAULT</span>
          </span>
        </Link>

        {/* Desktop Links - Updated for black background */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/solutions"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Solutions
          </Link>
          <Link
            href="/security"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Security
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </div>

        {/* Auth Actions - Updated for black background */}
        <div className="flex items-center gap-4">
          {!user && !isLoading ? (
            <div className="flex items-center gap-6">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-white text-black px-5 py-2.5 text-sm font-medium rounded-sm hover:bg-gray-200 transition-all"
              >
                Get Started
              </Link>
            </div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-900 transition-all"
              >
                {/* Profile Image or Icon */}
                {userAttributes?.picture ? (
                  <img
                    src={userAttributes.picture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-white/20 transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 border border-neutral-700 group-hover:bg-neutral-700 group-hover:text-white group-hover:border-neutral-600 transition-all">
                    <User size={16} />
                  </div>
                )}

                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors hidden sm:block">
                  Account
                </span>
                <ChevronDown
                  size={14}
                  className={`text-neutral-500 group-hover:text-white transition-all transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-64 bg-black border border-neutral-800 rounded-lg shadow-xl py-2 z-50 ring-1 ring-white/10"
                  >
                    <div className="px-4 py-3 border-b border-neutral-800 mb-1">
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-white truncate">
                        {userAttributes?.given_name && userAttributes?.family_name
                          ? `${userAttributes.given_name} ${userAttributes.family_name}`
                          : user.username}
                      </p>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {userAttributes?.email || ''}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                    >
                      <User size={16} /> Profile
                    </Link>

                    <div className="h-px bg-neutral-800 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-800 animate-pulse rounded-full" />
          )}
        </div>
      </div>
    </nav>
  );
}
