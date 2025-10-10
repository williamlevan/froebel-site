'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '../hooks/useSession';
import { useState } from 'react';
import '../styles/header.scss';

export default function Header() {
  const pathname = usePathname();
  const { user } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSignInPage = pathname === '/signin' || pathname.startsWith('/signin/');

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/volunteering', label: 'Volunteering' },
    { href: '/school-info', label: 'Location, Info and History' },
    { href: '/about', label: 'About Us' },
    { href: '/policies-and-guidelines', label: 'Policies and Guidelines' },
    // { href: '/portal', label: 'Volunteer Portal' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="site-title">
          <Link href="/">FROEBEL SCHOOL VOLUNTEER SITE</Link>
        </div>
        
        {/* Mobile menu button */}
        {!isSignInPage && (
          <button 
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        )}
        
        {/* Desktop navigation */}
        {!isSignInPage && (
          <nav className="header-nav desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            {isSignInPage ? null : (
              user ? (
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
              )
            )}
          </nav>
        )}
      </div>

      {/* Mobile navigation menu */}
      {!isSignInPage && (
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="mobile-nav-auth">
              {user ? (
                user.role === 'admin' ? (
                  <Link href="/admin" className="mobile-profile-button" onClick={closeMobileMenu}>
                    <span className="profile-icon">👤</span>
                    <span className="profile-name">{user.firstName}</span>
                  </Link>
                ) : (
                  <Link href="/user" className="mobile-profile-button" onClick={closeMobileMenu}>
                    <span className="profile-icon">👤</span>
                    <span className="profile-name">{user.firstName}</span>
                  </Link>
                )
              ) : (
                <Link href="/signin" className="mobile-sign-in-button" onClick={closeMobileMenu}>Sign In</Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}