'use client';

import Image from 'next/image';
import Header from '../components/header';
import '../styles/policies-and-guidelines.scss';

export default function PoliciesAndGuidelinesPage() {
  return (
    <div className="policies-page">
      <Header />
      <div className="header-padding"></div>

      <main className="policies-main">
        <div className="policies-container">
          <div className="page-title-container">
            <h1>Policies and Guidelines</h1>
          </div>

          <div className="content-container">
            <Image src="/images/IMG_3784.JPG" alt="Policies and Guidelines" width={800} height={529} />

            <div className="policies">
              <div className="policies-header">
                <h1>Accountability</h1>
              </div>
              <p>Volunteers are accountable to the Volunteer Manager, Ann Dillon. We ask all volunteers to sign up for shifts via our Volunteer Portal, (_____). This portal shows all shifts we have available, what each shift entails, and other information about Froebel School and our volunteer opportunities. As an important part of this organization, we encourage volunteers to bring suggestions, questions, concerns, and new ideas to the attention of Volunteer Manager.</p>
              <div className="policies-header">
                <h1>Recruitment</h1>
              </div>
              <p>We are always looking for new volunteers to join the Froebel School team. We welcome individuals, teachers, groups and students with a passion to support education and the Froebel community.</p>
              <div className="policies-header">
                <h1>Attire</h1>
              </div>
              <p>Guidelines for appropriate attire are comfortable clothing, shorts, jeans, and t-shirts. All shirts must cover the midriff and booty and be without offensive slogans. No torn clothing. Good personal hygiene is important. Closed toe, comfortable shoes should be worn as you will be on your feet a lot at the warehouse and somewhat at school. Please bring all personal items in a small crossbody purse or bum bag as we do not have the ability to store your items. Your items must stay with you at all times.</p>
              <div className="policies-header">
                <h1>Call-in Policy / Communication</h1>
              </div>
              <p>Please contact the Volunteer Manager, Ann Dillon, by text at <a href="tel:3146041280">(314) 604-1280</a> or <a href="mailto:anndillonmail@gmail.com">anndillonmail@gmail.com</a> as soon as possible if you are unable to volunteer your schedule shift.</p>
              <div className="policies-header">
                <h1>Sign-in Policy</h1>
              </div>
              <p>All volunteers must sign in at the beginning of the assigned shift and sign out at the end of the shift to ensure they get credit for volunteering. Volunteering at Froebel School: sign in at the Front ofIice, per SLPS policy, and again in your classroom if you are tracking volunteer hours. Volunteering at the warehouse: sign in by the main entrance on the backside of the building.</p>
              <div className="policies-header">
                <h1>Parking</h1>
              </div>
              <p>At Froebel School: parking on Nebraska, near Door #1, the main entrance of school, is the most convenient parking. The parking lot behind school is available to volunteers if space permits, as well. As a reminder, do not leave valuables inside your car. At the warehouse: park behind the building and near to the back door, which is our primary entrance.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
