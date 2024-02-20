import React, { useState } from "react";
import "./SearchPage.css"; // Ensure this CSS file contains the styles provided
import { FaUser, FaHeart, FaCalendarAlt, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Semantor = () => {
  const [activeTabs, setActiveTabs] = useState([]);
  const [searchType, setSearchType] = useState("semantic");
  const [isOpen, setIsOpen] = useState({ filters: false, history: false });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // Toggle tab activation
  const toggleTab = (tab) => {
    setActiveTabs(activeTabs.includes(tab) ? activeTabs.filter((t) => t !== tab) : [...activeTabs, tab]);
  };

  // Toggle dropdowns in sidebar
  const toggleDropdown = (dropdown) => {
    setIsOpen({ ...isOpen, [dropdown]: !isOpen[dropdown] });
  };

  const SidebarDropdown = ({ title, children, dropdownId }) => (
    <div className="sidebar-dropdown">
      <div className="sidebar-action" onClick={() => toggleDropdown(dropdownId)}>
        {title}
        {isOpen[dropdownId] ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isOpen[dropdownId] && <div className="dropdown-content">{children}</div>}
    </div>
  );

  return (
    <div className="semantor-container">
      <header className="semantor-header">
        <h1>SEMANTOR</h1>
        <div className="semantor-user-icons">
          <FaUser className="user-icon" />
          <FaHeart className="heart-icon" />
        </div>
      </header>

      <div className="semantor-body">
        <aside className="semantor-sidebar">
          <div className="sidebar-item">Your project</div>
          <div className="sidebar-item">Your history</div>
          <br />
          <div className="line"></div>
          <br />
          <SidebarDropdown title="+ Filters" dropdownId="filters">
            <label>
              Start date:
              <input type="date" name="start-date" />
            </label>
            <label>
              End date:
              <input type="date" name="end-date" />
            </label>
           
            <br />
            <label>
              <input type="checkbox" /> Granted
            </label>
            <br />
            <label>
              <input type="checkbox" /> Pregranted
            </label>
          </SidebarDropdown>
          <SidebarDropdown title="+ History" dropdownId="history">
          <div className="history-item">
            <span className="history-item-name">Semantor</span>
            <span className="history-item-date">12/31/2024</span>
          </div>
          </SidebarDropdown>
        </aside>

        <main className="semantor-main">
          <nav className="semantor-nav">
            {["abstract", "detail", "claims", "summary"].map((tab) => (
              <button
                key={tab}
                className={`nav-button ${activeTabs.includes(tab) ? "active" : ""}`}
                onClick={() => toggleTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="search-section">
            <div className="search-type-buttons">
              <button
                className={`search-type-button ${searchType === "semantic" ? "active" : ""}`}
                onClick={() => setSearchType("semantic")}
              >
                Semantic
              </button>
              <button
                className={`search-type-button ${searchType === "keyword" ? "active" : ""}`}
                onClick={() => setSearchType("keyword")}
              >
                Keyword
              </button>
            </div>
            
            <div className="search-input">
              <FaCalendarAlt className="calendar-icon" onClick={() => setIsCalendarOpen(!isCalendarOpen)} />
              {isCalendarOpen && (
                <DatePicker
                  selected={startDate}
                  onChange={onChange}
                  onClickOutside={() => setIsCalendarOpen(false)}
                  open={isCalendarOpen}
                  dropdownMode="select"
                  withPortal
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                />
              )}
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
