import React from "react";

const Privacy = () => {
  return (
    <div className="fgi-legal-page">
      <div className="fgi-legal-card">
        <h1>Privacy Policy</h1>
        <p className="fgi-legal-updated">Last updated: [Date]</p>

        <section>
          <h2>Information We Collect</h2>
          <p>
            When you use FillGap, we collect the information you provide directly,
            including your email address, resume content, job descriptions, and
            self-descriptions you submit for analysis.
          </p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>
            We use your resume and job description data solely to generate your
            personalized interview reports via our AI service provider (Google
            Gemini). We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2>Data Storage</h2>
          <p>
            Your reports and account information are stored securely in our
            database. You may request deletion of your account and associated
            data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            We use Google's GenAI API to process resume and job description
            content, and Brevo for transactional emails. These providers process
            data according to their own privacy policies.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this policy? Reach out via our <a href="/contact">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;