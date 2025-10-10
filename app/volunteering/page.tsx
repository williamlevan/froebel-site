'use client';

import Image from 'next/image';
import Header from '../components/header';
import '../styles/volunteering.scss';

export default function VolunteeringPage() {
    return (
        <div className="volunteering-page">
            <Header />
            <div className="header-padding"></div>

            <main className="volunteering-main">
                <div className="volunteering-container">
                    <div className="page-title-container">
                        <h1>Volunteering for Froebel</h1>
                        <p>We are so grateful for your interest and support! We are always looking for volunteers to support Froebel School in a myriad of differeny ways, as we want to ensure that these students can succeed at school.</p>
                    </div>

                    <div className="content-container">
                        <Image src="/images/IMG_3780.JPG" alt="Volunteering" width={800} height={463} />

                        <div className="opportunities">
                            <div className="opportunity-header">
                                <h1>Froebel School Opportunities</h1>
                            </div>
                            <h4><strong>NOTE: To volunteer at Froebel School, you must fill out a St. Louis Public Schools volunteer application. See bottom of this page for more information and links to these forms.</strong></h4>
                            <h2>Reading Buddies and Tutoring</h2>
                            <p>The most important of our endeavors is to spend time reading with the younger classes and tutoring the older students. If you can tutor regularly, you will be assigned a specific classroom that you will support. If you can't come on a regular basis, come on any available school days. Bring your friends and spend some time at school with our students! NOTE: scheduling is flexible!!! Come for any amount of time, on any day. <strong>WHEN YOU REGISTER</strong>, please note in the comments what days/time you will attend!</p>
                            <h2>School, Staff and Teacher Support</h2>
                            <p>We have other areas at school always need assistance, including teacher support, organizing the Eagle’s Nest Incentive Room and the Clothing Room. <strong>WHEN YOU REGISTER</strong>, please note in the comments what days/time you will attend!</p>
                            <div className="opportunity-header">
                                <h1>Warehouse Support</h1>
                            </div>
                            <p>Throughout the school year we support Froebel Elementary with supply drives for books, school supplies, and clothing items, including our biggest project, providing each student with a holiday gift bag. These items are sorted and stored in a warehouse in the Brentwood Industrial Court. On scheduled days, we meet at the warehouse to unpack and organize the donations, sort books by age and reading level, and pack the holiday bags. These 200+ bags are distributed in December at school to the families of each student.</p>
                            <ul>
                                <li>To sign up, Warehouse hours are on the calendar and usually include no more than 8 volunteers at a time. We can accommodate larger groups with advanced notice. Please contact Ann Dillon for more information <a href="tel:3146041280">(314) 604-1280</a>.</li>
                                <li>Warehouse address: 1326 Strassner Drive, St. Louis, MO 63144</li>
                            </ul>
                        </div>

                        <div className="application-section">
                            <h2 className="centered">To volunteer at school, you must complete an application with St. Louis Public Schools (SLPS)</h2>
                            <p className="centered">
                              As a reminder - 1 week is required to process new volunteers under 18; 3 weeks to process volunteers 18 and older.                               Have you already registered in the last 2 years? If so, you are already approved!
                            </p>
                            <div className="application-header">
                                <h1>Volunteers under 18 years old</h1>
                            </div>
                            <p>Download this form, print it out, complete it and send to PDF to <a href="mailto:anndillon@gmail.com">anndillon@gmail.com</a>.</p>
                            <div className="application-header">
                                <h1>Volunteers 18 and older</h1>
                            </div>
                            <p>The application is completely online and requires 3 steps</p>
                            <ol>
                                <li>Fill out the Personal Profile Form</li>
                                <ul>
                                    <li>Log on to the Nimble website: https://app.hirenimble.com/jobview/46249</li>
                                    <li>Click on the green "APPLY" button</li>
                                    <li>Fill out the "Complete Your Profile" form (This form is targeted towards paid employees so many of the questions do not apply to you. You only need to fill out required fieldsa marked with an asterisk (*))</li>
                                    <ul>
                                        <li>Page 1</li>
                                        <ul>
                                            <li>States of residence: enter "MO"</li>
                                        </ul>
                                        <li>Page 2</li>
                                        <ul>
                                            <li>Work experience: Enter "volunteer/unemployed/self-employed" if not employed. Add any dates and "currently employed/unemployed" as reason for leaving.</li>
                                            <li>No need to enter "Credentials" or "Languages"</li>
                                            <li>Reference is important - especially the email address. SLPS will reach out directly to the reference.</li>
                                            <li>How did you hear about us: enter "other</li>
                                        </ul>
                                        <li>Page 3</li>
                                        <ul>
                                            <li>School Preference: enter "Froebel Elementary"</li>
                                            <li>No need to enter "Services"</li>
                                            <li>No need to enter "Days to Volunteer"</li>
                                        </ul>
                                    </ul>
                                </ul>
                                <li>Missouri Background Application (MO FCSR)</li>
                                <ul>
                                    <li>Nimble will email out this form once it receives your completed "Personal Profile" application</li>
                                    <ul>
                                        <li>1st question is "Registration Type"; it will automatically default to "Child Care" - there is no need to change this.</li>
                                        <li>Note: SLPS is not currently requiring payment for processing the forms, so make sure to get your paperwork completed ASAP!</li>
                                    </ul>
                                </ul>
                                <li>SLPS will email your reference directly from your Personal Profile</li>
                                <ul>
                                    <li>Please notify your reference to look for their email!</li>
                                </ul>
                            </ol>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
