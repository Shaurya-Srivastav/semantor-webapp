import React, { useState } from "react";
import "./HistoryPage.css";
import { FaUser, FaHeart, FaCalendarAlt, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";
import PaginationControls from "../../Components/common/Pagination/PaginationControls";
import Result from "../../Components/common/Result/Result";


Modal.setAppElement('#root');


const Semantor = () => {
  const [activeTabs, setActiveTabs] = useState([]);
  const [isOpen, setIsOpen] = useState({ filters: false, history: false });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
          <div className="sidebar-item"><a href="/">Your Projects</a></div>
          <br></br>
          <div className="sidebar-item"><a href="/search">Back to Search....</a></div>
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
            <div class="checkbox-container">
              <label class="checkbox-label">
                <input type="radio" name="past-7-days" />
                <span class="checkmark"></span> Past 7 days
              </label>
              <br></br>
              <label class="checkbox-label">
                <input type="radio" name="past-14-days" />
                <span class="checkmark"></span> Past 14 days
              </label>
              <br></br>
              <label class="checkbox-label">
                <input type="radio" name="past-30-days" />
                <span class="checkmark"></span> Past 30 days
              </label>
              <br></br>
              <label class="checkbox-label">
                <input type="radio" name="past-3-months" />
                <span class="checkmark"></span> Past 3 months
              </label>
            </div>
            <button type="button" className="filter-submit-button">Apply Filters</button>
          </SidebarDropdown>
        </aside>

        <main className="semantor-main">
          <h1 className="project-title">Search History</h1>

          <div className="search-section">
            <div className="search-input">
              <input type="text" placeholder="Search...." />
              <FaSearch className="search-icon" />
            </div>
            <br></br>
            <br></br>

            <div className="result-box">
              <Result></Result>
            </div>


            <PaginationControls></PaginationControls>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Semantor;
