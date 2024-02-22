import React, { useState } from 'react';
import './Sidebar.css'; // Make sure to import the CSS file

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleSidebar} className={`sidebar-toggle ${isOpen ? 'open' : 'closed'}`}>
        {isOpen ? 'Close' : 'Open Sidebar'}
      </button>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <header className="semantor-header">
          <h1>SEMANTOR</h1>
        </header>
        <nav className="sidebar-nav">
          <a href='/' className="sidebar-button">Projects</a>
          <a href='/search' className="sidebar-button">Home</a>
          <a href='/' className="sidebar-button">Sign-out</a>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
