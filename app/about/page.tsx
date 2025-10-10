'use client';

import Header from '../components/header';
import '../styles/about.scss';

export default function AboutPage() {
  return (
    <div className="about-page">
      <Header />

      <div className="header-padding"></div>

      <main className="about-main">
        <div className="about-container">
          <div className="page-title-container">
            <h1>About Us</h1>
          </div>

          <div className="content-container">
            <div className="about-section">
              <div className="section-header">
                <h1>Meet Ann Grove Dillon</h1>
              </div>
              <p>
                My name is Ann Grove Dillon. My family and I have been volunteering with Froebel School
                for almost 25 years, organizing coat drives and distributing books to students, otherwise
                known as Book Buffets. In 2020, we began collecting donations so that the students could
                enjoy the holidays. This donation collection has grown into a year-round opportunity to
                support the greater Froebel School community.
              </p>
              <p>
                I coordinate with multiple philanthropy organizations, including National Charity League
                (NCL) and Young Men's Service League (YMSL), and as well as many local schools,
                including John Burroughs, Cor Jesu Academy, St. Louis University High School (SLUH),
                Villa Duchesne and Visitation Academy. We are always looking for additional partners!
                Please contact me for more information and additional ways to support Froebel
                Elementary.
              </p>
            </div>

            <div className="contact-section">
              <div className="section-header">
                <h1>Contact Information</h1>
              </div>
              <p><strong>Ann Dillon</strong></p>
              <p><a href="mailto:anndillonmail@gmail.com">anndillonmail@gmail.com</a></p>
              <p><a href="tel:3146041280">(314) 604-1280</a></p>
            </div>

            <div className="support-section">
              <div className="section-header">
                <h1>Ways in which we support our teachers:</h1>
              </div>
              <ul>
                <li>We collect donations over the summer so that every student can have the school
                supplies that they need to succeed in school – folders, paper, crayons or markers or
                colored pencils, glue sticks, erasers, pencils, backpacks, etc.</li>
                <li>We sponsor workdays in August when the teachers return to school. We decorate
                bulletin boards, set up the classrooms, organize educational material, and do
                whatever else our wonderful teachers need to have a great year.</li>
                <li>We assist in the classrooms to provide additional support to kids that might need a
                little extra help.</li>
                <li>We decorate the Teacher's Lounge to provide a calm area for our teachers.</li>
                <li>We provide holiday gifts for every teacher and staff member</li>
              </ul>
            </div>

            <div className="support-section">
              <div className="section-header">
                <h1>Ways in which we support our students:</h1>
              </div>
              <ul>
                <li>We look for weekly tutors to support the students in the classroom.</li>
                <li>We sponsor programs and performances that will inspire and excite the students</li>
                <li>We hold multiple Book Buffets throughout the year where the students can choose
                up to 5 books that are theirs to keep.</li>
                <li>We provide a wide range of toys/games/school supplies for the Eagle's Nest
                Incentive Room. The students earn points for good behavior, outstanding
                classwork, kindness, and timeliness which they can spend on the items in the
                Incentive Room.</li>
                <li>We purchase and collect gently used outer wear to stock the Clothing Room. This
                includes coats, sweaters, sweatshirts, hoodies, fleeces, jackets, raincoats,
                sweatpants, pants, shoes, hats, gloves and scarves.</li>
                <li>We distribute holiday bags to every child in school in December. These bags
                included many diverse purchased or donated items including socks, underwear,
                hats, gloves and scarves, toothbrushes and toothpaste, body wash, art kits, science
                kits, board games, school supplies, balls, activity books, stuffed animals and
                blankets, as well as the opportunity to pick as many books and as much clothing as
                they might need. The families are invited to collect the holiday bags and shop for
                their child, as well as for themselves and other family members.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
