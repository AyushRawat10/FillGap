import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Home, LayoutDashboard, KeyRound, LogOut } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fgic-dash-nav">
      <div className="fgic-dash-left">
        <span className="fgic-dash-logo">FILL GAP</span>
      </div>

      <div className="fgic-dash-right" ref={dropdownRef}>
        <button
          className="fgic-toggle-btn"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
          <ChevronDown
            size={16}
            className={`fgic-toggle-icon ${open ? "fgic-toggle-icon-open" : ""}`}
          />
        </button>

        {open && (
          <div className="fgic-dropdown">
            <a href="#" className="fgic-dropdown-item">
              <Home size={16} />
              Home
            </a>
            <a href="#" className="fgic-dropdown-item">
              <LayoutDashboard size={16} />
              Dashboard
            </a>
            <a href="#" className="fgic-dropdown-item">
              <KeyRound size={16} />
              Change Password
            </a>
            <a href="#" className="fgic-dropdown-item">
              <LogOut size={16} />
              Logout
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;