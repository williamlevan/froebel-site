'use client';

import Link from 'next/link';
import '../styles/footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/volunteering">Volunteering</Link></li>
            <li><Link href="/school-info">School Information</Link></li>
            <li><Link href="/policies-and-guidelines">Policies & Guidelines</Link></li>
            {/* <li><Link href="/portal">Portal</Link></li> */}
            {/* <li><Link href="/forms">Forms</Link></li> */}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Information</h3>
          <div className="contact-info">
            <p><strong>Ann Dillon</strong></p>
            <p>Volunteer Coordinator</p>
            <p><a href="mailto:anndillonmail@gmail.com">anndillonmail@gmail.com</a></p>
            <p><a href="tel:3146041280">(314) 604-1280</a></p>
          </div>
        </div>

        <div className="footer-section">
          <h3>School Information</h3>
          <div className="school-info">
            <p><strong>Froebel Literacy Academy</strong></p>
            <p>3709 Nebraska Avenue</p>
            <p>St. Louis, MO 63118</p>
            <p><a href="tel:3146041280">(314) 604-1280</a></p>
            <p><strong>Principal:</strong> Mr. Tim Craig</p>
            <p><strong>School Hours:</strong> 9:25AM - 4:22PM</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Froebel Literacy Academy. All rights reserved.</p>
      </div>
    </footer>
  );
}
