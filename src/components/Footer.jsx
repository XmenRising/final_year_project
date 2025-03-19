'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export default function Footer() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (loggedIn) {
    // Fixed minimal footer for logged-in users
    return (
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Textbook Exchange. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  // Full footer for visitors (not logged in)
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-gray-400">
              Textbook Exchange is a platform dedicated to making educational materials accessible to everyone.
            </p>
          </div>
  
          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-green-500">
                  Home
                </a>
              </li>
              <li>
                <a href="/materials" className="text-gray-400 hover:text-green-500">
                  Materials
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-400 hover:text-green-500">
                  Support
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-green-500">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
  
          {/* Socials Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500">
                YouTube
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500">
                TikTok
              </a>
            </div>
          </div>
        </div>
  
        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Textbook Exchange. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
