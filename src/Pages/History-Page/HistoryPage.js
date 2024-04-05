import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you use axios for HTTP requests
import "./HistoryPage.css";
import { FaUser, FaHeart, FaCalendarAlt, FaSearch, FaChevronDown, FaChevronUp, FaSignOutAlt } from "react-icons/fa";
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";
import PaginationControls from "../../Components/common/Pagination/PaginationControls";
import Result from "../../Components/common/Result/Result";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
Modal.setAppElement('#root');



const Semantor = () => {
  const { logout } = useAuth();
  const [currentPageMap, setCurrentPageMap] = useState({});
  const itemsPerPage = 10;

  const [activeTabs, setActiveTabs] = useState([]);
  const [isOpen, setIsOpen] = useState({ filters: false, history: false });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const [searchHistory, setSearchHistory] = useState([]);

  const navigate = useNavigate();

  

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const onPageChange = (historyItemId, newPage) => {
    setCurrentPageMap(prev => ({ ...prev, [historyItemId]: newPage }));
  };

  const fetchSearchHistory = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found"); // Or handle the lack of a token as needed
        return;
      }
  
      // Include the Authorization header with the token
      const response = await axios.get("http://150.136.47.221:5000/get_search_history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parsedHistory = response.data.map(item => ({
        ...item,
        results: JSON.parse(item.results) // Parse the results string into an array
      }));
      setSearchHistory(parsedHistory);
      console.log(parsedHistory)
    } catch (error) {
      console.error("Failed to fetch search history:", error);
    }
  };

  fetchSearchHistory();

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

  const handleHistoryItemClick = (historyItem) => {
    navigate('/search', { state: { historyItem: historyItem } });
  };
  



  return (
    <div className="semantor-container">
      <header className="semantor-header">
        <h1>SEMANTOR</h1>
        <div className="semantor-user-icons">
        <div className="user-dropdown" onClick={logout}>
            <FaSignOutAlt className="user-icon" />
          </div>
          <FaHeart className="heart-icon" />
        </div>
      </header>

      <div className="semantor-body">
        <aside className="semantor-sidebar">
          <div className="sidebar-item"><a href="/project">Your Projects</a></div>
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
              <input type="text" placeholder="Search...." onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // handleSearch(e);
                }
              }} />
              <FaSearch className="search-icon" />
            </div>
            <br></br>
            <br></br>

            <div className="history-items-container"> {/* Make sure this div aligns with your search bar's width */}
          {searchHistory.map((historyItem, index) => (
            <div key={historyItem.id} className="search-result" onClick={() => handleHistoryItemClick(historyItem)}>
              <div className="search-result-header">
                <div className="search-result-title-section">
                  <h2 className="search-result-title">{truncateText(historyItem.query, 10)}</h2>
                  <div className="search-result-subtitle">
                    {/* If there's additional info like date you want to include, do it here */}
                    {/* <span>{historyItem.date}</span> */}
                  </div>
                </div>
                <div className="search-result-meta">
                  {/* Meta information like buttons or icons */}
                </div>
              </div>
              {/* Description or other content can go here */}
            </div>
          ))}
        </div>
            



            <PaginationControls></PaginationControls>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Semantor;
