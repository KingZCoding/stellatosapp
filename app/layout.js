'use client';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import '../styles/layout.css';
import Image from 'next/image';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <title>Stellatos Market</title>
      <head>
        <meta name="description" content="Welcome to Stellatos Market!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SessionProvider>
          {/* Top Navigation Bar */}
          <header className="header">
            <button
              onClick={toggleSidebar}
              className="sidebar-toggle"
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar"
            >
              ☰ Menu
            </button>
            {/* Profile Picture */}
            <div className="profile-picture-container">
              <ProfileButton />
            </div>
          </header>

          {/* Sidebar */}
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

          {/* Main Content */}
          <main className="content">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}

// Profile Button Component
function ProfileButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Link href="/profile">
        <Image
          src={session.user.image || '/default-avatar.png'}
          alt={session.user.name || 'User'}
          className="profile-picture"
          width={50}
          height={50}
        />
      </Link>
    );
  }

  return (
    <Link href="/auth" className="login-link">
      Login/Sign Up
    </Link>
  );
}
