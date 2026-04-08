"use client";

import Link from "next/link";
import { Activity, Menu, X, User as UserIcon, LogOut, Snail, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFirebase } from "./firebase-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, profile, loading, signInWithGoogle, logout } = useFirebase();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Gear Reviews", href: "/#gear" },
    { name: "Training & Strength", href: "/#training" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group overflow-hidden py-2 pr-2">
              <motion.div 
                animate={{ x: [0, 12, 0], scaleX: [1, 1.1, 1], scaleY: [1, 0.9, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="text-orange-500"
              >
                <Snail className="h-8 w-8" />
              </motion.div>
              <span className="font-bold text-2xl tracking-tight text-slate-900 font-serif">
                Snail<span className="text-orange-500 italic">Runner</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 pl-10 pr-4 py-2 rounded-full bg-slate-100 border-transparent focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-200 text-sm transition-all outline-none"
                suppressHydrationWarning
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {!loading && (
              user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    {profile?.photoURL ? (
                      <Image 
                        src={profile.photoURL} 
                        alt="Profile" 
                        width={36} 
                        height={36} 
                        className="rounded-full border-2 border-orange-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center border-2 border-orange-200">
                        <UserIcon className="h-5 w-5" />
                      </div>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900 truncate">{profile?.displayName || user.email}</p>
                        </div>
                        <Link 
                          href="/profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          My Profile
                        </Link>
                        {(profile?.role === 'admin' || user.email === 'chm810302@gmail.com') && (
                          <Link 
                            href="/admin" 
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            Write Post
                          </Link>
                        )}
                        <button 
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            {!loading && !user && (
              <button 
                onClick={signInWithGoogle}
                className="text-sm font-medium text-orange-600"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-orange-500 transition-colors p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-orange-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <form onSubmit={handleSearch} className="relative mb-4 mt-2">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 border-transparent focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-200 text-sm transition-all outline-none"
                  suppressHydrationWarning
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </form>

              {user && (
                <div className="px-3 py-3 mb-2 border-b border-slate-100 flex items-center gap-3">
                  {profile?.photoURL ? (
                    <Image 
                      src={profile.photoURL} 
                      alt="Profile" 
                      width={40} 
                      height={40} 
                      className="rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{profile?.displayName || "Runner"}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              )}
              
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {user && (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 text-base font-medium text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    My Profile
                  </Link>
                  {(profile?.role === 'admin' || user.email === 'chm810302@gmail.com') && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 text-base font-medium text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                    >
                      Write Post
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
