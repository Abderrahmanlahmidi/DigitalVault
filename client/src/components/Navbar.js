"use client";
import { useState, useEffect } from "react";
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
  Store,
  Shield,
  HelpCircle,
  Package,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, profile, isLoading, logout, hasRole } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    setIsDropdownOpen(false);
    router.push("/");
  };

  const isSeller = hasRole('SELLER');

  const NAV_LINKS = [
    { name: "Products", href: "/products" },
    { name: "Solutions", href: "/solutions" },
    { name: "Security", href: "/security" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "py-3 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-2xl"
        : "py-6 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-white/10">
            <Shield className="text-black" size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            DIGITAL<span className="font-light text-neutral-400">VAULT</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center bg-white/5 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-2xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-6 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/10"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions & Mobile Trigger */}
        <div className="flex items-center gap-4">
          {/* Add Product Button - Only for Sellers */}
          {user && isSeller && (
            <Link
              href="/create-product"
              className="hidden md:flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Store size={16} />
              <span>Create</span>
            </Link>
          )}

          {!user && !isLoading ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-6 py-2.5 text-sm font-medium text-white hover:text-neutral-300 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-white text-black px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-xl shadow-black/20 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`group flex items-center gap-3 p-1.5 rounded-xl transition-all duration-300 border ${isDropdownOpen
                  ? "bg-white/10 border-white/20"
                  : "bg-transparent border-transparent hover:bg-white/5"
                  }`}
              >
                {profile?.profileImageUrl ? (
                  <div className="relative">
                    <img
                      src={profile.profileImageUrl}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-white/20 transition-all border border-white/10"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black" />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 border border-neutral-700 group-hover:bg-neutral-700 group-hover:text-white transition-all">
                    <User size={18} />
                  </div>
                )}
                <ChevronDown
                  size={14}
                  className={`text-neutral-500 group-hover:text-white transition-all transform mr-1 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-72 bg-neutral-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-3 z-50 overflow-hidden ring-1 ring-white/5"
                    >
                      <div className="px-6 py-4 border-b border-white/5 mb-2 bg-white/5">
                        <p className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.2em] mb-2">
                          Account Security
                        </p>
                        <p className="text-base font-bold text-white truncate">
                          {profile?.firstName && profile?.lastName
                            ? `${profile.firstName} ${profile.lastName}`
                            : user.username}
                        </p>
                        <p className="text-xs text-neutral-400 truncate mt-1">
                          {profile?.email || ""}
                        </p>
                      </div>

                      <div className="px-2 space-y-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-white/10 hover:text-white rounded-2xl transition-all group"
                        >
                          <div className="p-2 bg-neutral-800 rounded-lg group-hover:bg-neutral-700 transition-colors">
                            <LayoutDashboard size={16} />
                          </div>
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-white/10 hover:text-white rounded-2xl transition-all group"
                        >
                          <div className="p-2 bg-neutral-800 rounded-lg group-hover:bg-neutral-700 transition-colors">
                            <User size={16} />
                          </div>
                          <span className="font-medium">Profile Settings</span>
                        </Link>
                        {isSeller && (
                          <Link
                            href="/my-products"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-white/10 hover:text-white rounded-2xl transition-all group"
                          >
                            <div className="p-2 bg-neutral-800 rounded-lg group-hover:bg-neutral-700 transition-colors">
                              <Package size={16} className="text-emerald-400" />
                            </div>
                            <span className="font-medium text-emerald-400">My Products</span>
                          </Link>
                        )}
                      </div>

                      <div className="h-px bg-white/5 my-2 mx-4" />

                      <div className="px-2">
                        <button
                          onClick={() => {
                            setIsLogoutModalOpen(true);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all group"
                        >
                          <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors text-rose-500">
                            <LogOut size={16} />
                          </div>
                          <span className="font-bold uppercase tracking-wider text-xs">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-10 h-10 bg-white/5 border border-white/10 animate-pulse rounded-full" />
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-all duration-300 ${isMobileMenuOpen
              ? "bg-white text-black"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-950/95 backdrop-blur-3xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <span className="font-bold text-neutral-300 group-hover:text-white">{link.name}</span>
                  </Link>
                ))}
              </div>

              {user && isSeller && (
                <Link
                  href="/create-product"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-5 bg-emerald-500 text-black rounded-3xl group active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Store size={24} />
                    <span className="font-black text-xl italic uppercase tracking-tighter">Add Product</span>
                  </div>
                  <ChevronDown size={24} className="-rotate-90 opacity-40" />
                </Link>
              )}

              {!user && !isLoading && (
                <div className="pt-10 flex flex-col gap-4">
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-5 bg-white text-black font-black text-xl rounded-3xl shadow-xl shadow-white/5 active:scale-95 transition-all"
                  >
                    GET STARTED
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-5 text-neutral-400 font-bold border border-white/5 rounded-3xl"
                  >
                    SIGN IN
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleSignOut}
      />
    </nav>
  );
}
