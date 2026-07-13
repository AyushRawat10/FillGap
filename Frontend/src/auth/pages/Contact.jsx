import React from "react";
import { Mail, FolderGit2, Users } from "lucide-react";
import "../styles/Legal.css"

const Contact = () => {
  return (
    <div className="fgi-legal-page">
      <div className="fgi-legal-card">
        <h1>Contact Us</h1>
        <p className="fgi-legal-updated">Get in touch with the FillGap team.</p>

        <div className="fgi-contact-list">
          <a href="mailto:your-email@example.com" className="fgi-contact-item">
            <Mail size={20} />
            <span>rawatayushh10@gmail.com</span>
          </a>
          <a href="https://github.com/AyushRawat10" target="_blank" rel="noopener noreferrer" className="fgi-contact-item">
            <FolderGit2 size={20} />
            <span>github.com/AyushRawat10</span>
          </a>
          <a href="https://linkedin.com/in/ayush-rawat-59579b380" target="_blank" rel="noopener noreferrer" className="fgi-contact-item">
            <Users size={20} />
            <span>linkedin.com/in/ayush-rawat-59579b380</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;