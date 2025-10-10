'use client';

import Image from 'next/image';
import Header from '../components/header';
import '../styles/school-info.scss';

export default function SchoolInfoPage() {
  return (
    <div className="school-info-page">
      <Header />

      <div className="header-padding"></div>

      <main className="school-info-main">
        <div className="school-info-container">
          <div className="page-title-container">
            <h1>Froebel School Location, Information and History</h1>
          </div>

          <div className="content-container">
            <Image src="/images/IMG_3779.jpg" alt="Froebel School" width={800} height={533} />

            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6237.265280607741!2d-90.23652632336936!3d38.588306671791784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d8b4129e4e7151%3A0x89d37c90a01e8f8d!2sFroebel%20Elementary%20School!5e0!3m2!1sen!2sus!4v1760071385806!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Froebel School Location"
              ></iframe>
              <div className="map-container-text">
                <p>Address: 3709 Nebraska Avenue, St. Louis, MO 63118</p>
                <p>Principal: Mr. Tim Craig</p>
                <p>School Hours: 9:25AM - 4:22AM</p>
                <p>Phone: <a href="tel:3146041280">(314) 604-1280</a></p>
              </div>
            </div>
            <div className="info-container">
              <p>Froebel Literacy Academy serves elementary school schildren in grades pre-kindergarten through 5th grade on the Southside of St. Louis, in the Gravois-Jefferson neighborhood.</p>
              <div className="stats-container">
                <div className="stat">
                  <p>TOTAL ENROLLMENT</p>
                  <h4>188 students</h4>
                </div>
                <div className="stat">
                  <p>MINORITY ENROLLMENT</p>
                  <h4>97%</h4>
                </div>
                <div className="stat">
                  <p>ECONOMICALLY DISADVANTAGED</p>
                  <h4>98%</h4>
                </div>
                <div className="stat">
                  <p>STUDENT-TEACHER RATIO</p>
                  <h4>13:1</h4>
                </div>
                <div className="stat">
                  <p>CERTIFIED TEACHERS</p>
                  <h4>100%</h4>
                </div>
              </div>
              <p>Froebel Literacy Academy began in 1895 as the Nebraska Avenue School in the Saint Louis Public School District, changing its name to Froebel School in honor of the founder of the Kindergarten system, Friedrich Froebel. The school has undergone name changes to Froebel Elementary School and eventually Froebel Literacy Academy, incorporating renovations and additions to serve the community on the Southside. It is known for its focus on literacy, and in 2022, it became the first in the district to host a St. Louis Black Authors of Children's Literature "Believe Project Literacy Lab."</p>
              <div className="info-header">
                <h1>Mission and Vision</h1>
              </div>
              <h4><span className="highlighted">Mission:</span> Inspire students to achieve and take ownership of their learning and behavior.</h4>
              <h4><span className="highlighted">Vision:</span> Students will engage in critical thinking, reading and writing across the curriculum.</h4>
              <h4><span className="highlighted">Values:</span> Ability, Achievement, Accountability</h4>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
