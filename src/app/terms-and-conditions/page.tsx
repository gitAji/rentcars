"use client";

import { useState, useEffect } from "react"; // Added
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/loading"; // Added

export default function TermsAndConditionsPage() {
  const [isLoading, setIsLoading] = useState(true); // Added

  useEffect(() => { // Added
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) { // Added
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-neutral">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Terms and Conditions</h1>
        <p className="mb-4 text-gray-600">
          Please read these terms and conditions carefully before using Our Service.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Interpretation and Definitions</h2>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Interpretation</h3>
        <p className="mb-4 text-gray-600">
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Definitions</h3>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
          <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to RentCars.</li>
          <li><strong>Country</strong> refers to: Norway</li>
          <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
          <li><strong>Service</strong> refers to the Website.</li>
          <li><strong>Terms and Conditions</strong> (also referred as &quot;Terms&quot;) mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
          <li><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</li>
          <li><strong>Website</strong> refers to RentCars, accessible from https://www.rentcars.com</li>
          <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Acknowledgement</h2>
        <p className="mb-4 text-gray-600">
          These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
        </p>
        <p className="mb-4 text-gray-600">
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
        </p>
        <p className="mb-4 text-gray-600">
          By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
        </p>
        <p className="mb-4 text-gray-600">
          You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
        </p>
        <p className="mb-4 text-gray-600">
          Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Links to Other Websites</h2>
        <p className="mb-4 text-gray-600">
          Our Service may contain links to other websites that are not operated by the Company. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Terms and Conditions of every site You visit.
        </p>
        <p className="mb-4 text-gray-600">
          We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Termination</h2>
        <p className="mb-4 text-gray-600">
          We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
        </p>
        <p className="mb-4 text-gray-600">
          Upon termination, Your right to use the Service will cease immediately.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Limitation of Liability</h2>
        <p className="mb-4 text-gray-600">
          Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.
        </p>
        <p className="mb-4 text-gray-600">
          To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">&quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer</h2>
        <p className="mb-4 text-gray-600">
          The Service is provided to You &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.
        </p>
        <p className="mb-4 text-gray-600">
          Without limiting the foregoing, neither the Company nor any of the Company&apos;s provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Governing Law</h2>
        <p className="mb-4 text-gray-600">
          The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Disputes Resolution</h2>
        <p className="mb-4 text-gray-600">
          If You have any concern or dispute about the Service, You agree to first try to resolve the dispute in good faith by contacting the Company.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">For European Union (EU) Users</h2>
        <p className="mb-4 text-gray-600">
          If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident from.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">United States Legal Compliance</h2>
        <p className="mb-4 text-gray-600">
          You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Severability and Waiver</h2>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Severability</h3>
        <p className="mb-4 text-gray-600">
          If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
        </p>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Waiver</h3>
        <p className="mb-4 text-gray-600">
          Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not effect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Changes to These Terms and Conditions</h2>
        <p className="mb-4 text-gray-600">
          We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
        </p>
        <p className="mb-4 text-gray-600">
          By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Website and the Service.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
        <p className="mb-4 text-gray-600">
          If you have any questions about these Terms and Conditions, You can contact us:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-600">
          <li>By email: info@rentcars.com</li>
          <li>By visiting this page on our website: https://www.rentcars.com/contact</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}
