import React from "react";

function Navbar() {
  const today = new Date().toLocaleDateString();
  return (
    <div className="navbar">
      <span>Today: {today}</span>
    </div>
  );
}

export default Navbar;
