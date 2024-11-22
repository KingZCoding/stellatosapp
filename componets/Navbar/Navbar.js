'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import '../../styles/layout.css';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="header">
      <div className="logo">
        <Link href="/">
          <h1>Stellatos Market</h1>
        </Link>
      </div>
      <div className="profile-picture-container">
        {session ? (
          <Link href="/profile">
            <img
              src={session.user.image || '/default-avatar.png'}
              alt={session.user.name || 'User'}
              className="profile-picture"
            />
          </Link>
        ) : (
          <Link href="/auth" className="login-link">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
