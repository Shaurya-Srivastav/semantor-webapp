import React, { useState } from "react";
import "./SearchPage.css"; // Make sure to create this CSS file and include the styles
import { FaUser, FaHeart, FaCalendar, FaSearch, FaChevronDown, FaChevronUp} from "react-icons/fa";

const Semantor = () => {
  // Initialize with an empty array for no active tabs or with some default active tabs
  const [activeTabs, setActiveTabs] = useState([]);

  // Function to handle click events on tabs
  const toggleTab = (tab) => {
    setActiveTabs(
      activeTabs.includes(tab)
        ? activeTabs.filter((t) => t !== tab) // Remove tab if it was already active
        : [...activeTabs, tab] // Add tab if it wasn't active
    );
  };
  const [searchType, setSearchType] = useState("semantic");


  const SidebarDropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="sidebar-dropdown">
        <div className="sidebar-action" onClick={() => setIsOpen(!isOpen)}>
          {title}
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {isOpen && <div className="dropdown-content">{children}</div>}
      </div>
    );
  };

  return (
    <div className="semantor-container">
      <header className="semantor-header">
        <h1>SEMANTOR</h1>
        <div className="line"></div>
        <div className="semantor-user-icons">
          <FaUser className="user-icon" />
          <FaHeart className="heart-icon" />
        </div>
      </header>

      <div className="semantor-body">
        <aside className="semantor-sidebar">
        <div className="sidebar-item">Your project</div>
        <div className="sidebar-item">Your history</div>
        <br></br>
        <div className="line"></div>
        <br></br>
        <SidebarDropdown title="+ Filters">
          <label>
            Start date:
            <input type="date" name="start-date" />
          </label>
          <label>
            End date:
            <input type="date" name="end-date" />
          </label>
          <div className="line"></div>
          <br></br>
          <label>
            <input type="checkbox" /> Granted
          </label>
          <div className="line"></div>
          <br></br>
          <label>
            <input type="checkbox" /> Pregranted
          </label>
          
        </SidebarDropdown>
        <SidebarDropdown title="+ History">
          {/* Map over your history items and render them here */}
          <div className="history-item">
            <span className="history-item-name">Item Nameasdhasdkjashkjdahskjdas</span>
            <span className="history-item-date">12/30/2024</span>
          </div>
          <div className="history-item">
            <span className="history-item-name">Item Nameasdhasdkjashkjdahskjdas</span>
            <span className="history-item-date">Date</span>
          </div>
          <div className="history-item">
            <span className="history-item-name">Item Nameasdhasdkjashkjdahskjdas</span>
            <span className="history-item-date">Date</span>
          </div>
        </SidebarDropdown>
      </aside>

        <main className="semantor-main">
          <nav className="semantor-nav">
            {["abstract", "detail", "claims", "summary"].map((tab) => (
              <button
                key={tab}
                className={`nav-button ${
                  activeTabs.includes(tab) ? "active" : ""
                }`}
                onClick={() => toggleTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                {/* Capitalize first letter */}
              </button>
            ))}
          </nav>

          <br></br>

          <div className="search-section">
            <div className="search-type-buttons">
              <button
                className={`search-type-button ${
                  searchType === "semantic" ? "active" : ""
                }`}
                onClick={() => setSearchType("semantic")}
              >
                Semantic
              </button>
              <button
                className={`search-type-button ${
                  searchType === "keyword" ? "active" : ""
                }`}
                onClick={() => setSearchType("keyword")}
              >
                Keyword
              </button>
            </div>
            
            <div className="search-input">
              <FaCalendar className="calendar-icon" />
              <input type="text" placeholder="Semantic / Keyword Search:" />
              <FaSearch className="search-icon" />
            </div>
          </div>

        </main>


      </div>



    </div>
  );
};

export default Semantor;
