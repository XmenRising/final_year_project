'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaTwitter, FaInstagram, FaFacebookF, FaTiktok, FaBars, FaTimes } from 'react-icons/fa';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.mobile-menu') &&
        !event.target.closest('.hamburger-button')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <img 
                src="/images/slide4.jpg" 
                alt="Foundation Logo"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-3 border-l border-gray-300 pl-4">
                <div className="text-white text-sm tracking-tight">Chidiebere</div>
                <div className="text-white text-sm tracking-tight">Nkwazema</div>
                <div className="text-white text-sm tracking-tight">Foundation</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                Profile
              </Link>
              <Link href="/logout" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                Logout
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/materials" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                Materials
              </Link>
              <Link href="/support" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                Support
              </Link>
              <Link href="/about" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                Contact: (555) 123-4567
              </Link>
              <Link href="/login" className="text-gray-200 hover:text-white text-sm font-medium transition-colors">
                Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="hamburger-button md:hidden text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu md:hidden ${isOpen ? 'block' : 'hidden'} absolute right-0 left-0 bg-gray-800 z-50`}>
          <div className="px-4 pt-2 pb-4 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block text-gray-200 hover:text-white py-2">
                  Dashboard
                </Link>
                <Link href="/profile" className="block text-gray-200 hover:text-white py-2">
                  Profile
                </Link>
                <Link href="/logout" className="block text-gray-200 hover:text-white py-2">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="block text-gray-200 hover:text-white py-2">
                  Home
                </Link>
                <Link href="/materials" className="block text-gray-200 hover:text-white py-2">
                  Materials
                </Link>
                <Link href="/support" className="block text-gray-200 hover:text-white py-2">
                  Support
                </Link>
                <Link href="/about" className="block text-gray-200 hover:text-white py-2">
                  About
                </Link>
                <Link href="/contact" className="block text-gray-200 hover:text-white py-2">
                  Contact: (555) 123-4567
                </Link>
                <Link href="/login" className="block text-gray-200 hover:text-white py-2">
                  Login
                </Link>
              </>
            )}

            {/* Mobile Social Icons */}
            <div className="flex items-center space-x-3 pt-4">
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                <FaTwitter className="h-5 w-5 text-gray-800" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                <FaInstagram className="h-5 w-5 text-gray-800" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                <FaFacebookF className="h-5 w-5 text-gray-800" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                <FaTiktok className="h-5 w-5 text-gray-800" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
