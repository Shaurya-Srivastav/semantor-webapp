import React, { useState } from "react";
import "./SearchPage.css";
import { FaUser, FaHeart, FaCalendarAlt, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";
import PaginationControls from "../../Components/common/Pagination/PaginationControls";
import Result from "../../Components/common/Result/Result";


Modal.setAppElement('#root');


const Semantor = () => {
  const [activeTabs, setActiveTabs] = useState([]);
  const [searchType, setSearchType] = useState("semantic");
  const [isOpen, setIsOpen] = useState({ filters: false, history: false });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);



  const openModal = () => {
    setModalIsOpen(true);
  };


  const closeModal = () => {
    setModalIsOpen(false);
  };


  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };


  const toggleTab = (tab) => {
    setActiveTabs(activeTabs.includes(tab) ? activeTabs.filter((t) => t !== tab) : [...activeTabs, tab]);
  };


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


  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState('');

  const toggleLike = () => {
    setIsLiked(!isLiked);


    setLikeAnimation('like-animation');


    setTimeout(() => {
      setLikeAnimation('');
    }, 600);
  };

  function truncateText(text, wordLimit) {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  }

  const downloadFile = () => {

    console.log('Download button clicked');

  };



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
          <div className="sidebar-item"><a href="/project">Your Projects</a></div>
          <br></br>
          <div className="sidebar-item"><a href="/history">Your history</a></div>
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
            <label>
              <input type="checkbox" /> Granted
            </label>
            <label>
              <input type="checkbox" /> Pregranted
            </label>
            { }
            <button type="button" className="filter-submit-button">Apply Filters</button>
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
            <br></br>
            <br></br>

        
            <Result></Result>


            <PaginationControls></PaginationControls>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Semantor;
