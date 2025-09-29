'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '../hooks/useSession';
import '../styles/header.scss';

export default function Header() {
  const pathname = usePathname();
  const { user } = useSession();

  const isSignInPage = pathname === '/signin' || pathname.startsWith('/signin/');

  return (
    <header className="header">
      <div className="header-content">
        <div className="site-title">
          <Link href="/home">Froebel School Volunteer Site</Link>
        </div>
        
        {isSignInPage ? null : (
          <div className="header-actions">
            {user ? (
                user.role === 'admin' ? (
                    <Link href="/admin" className="profile-button">
                    <span className="profile-icon">👤</span>
                    <span className="profile-name">{user.firstName}</span>
                  </Link>
                ) : (
                    <Link href="/user" className="profile-button">
                    <span className="profile-icon">👤</span>
                    <span className="profile-name">{user.firstName}</span>
                  </Link>
                )
            ) : (
              <Link href="/signin" className="sign-in-button">Sign In</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}