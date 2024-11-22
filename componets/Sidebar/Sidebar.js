'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../../styles/layout.css';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle"
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
      >
        ☰ Menu
      </button>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          ✖
        </button>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link href="/" onClick={toggleSidebar}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/placeOrder" onClick={toggleSidebar}>
                Place an Order
              </Link>
            </li>
            <li>
              <Link href="/locations" onClick={toggleSidebar}>
                Locations
              </Link>
            </li>
            <li>
              <Link href="/cart" onClick={toggleSidebar}>
                Your Cart
              </Link>
            </li>
            <li>
              <Link href="/auth" onClick={toggleSidebar}>
                Login / Signup
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
