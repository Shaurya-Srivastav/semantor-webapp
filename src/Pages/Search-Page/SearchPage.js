import React, { useState, useEffect } from "react";
import { BeatLoader } from 'react-spinners';
import axios from "axios";
import "./SearchPage.css";
import { FaUser, FaHeart, FaCalendarAlt, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PaginationControls from "../../Components/common/Pagination/PaginationControls";
import Result from "../../Components/common/Result/Result";
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Semantor = () => {
  const [activeTabs, setActiveTabs] = useState([]);
  const [searchType, setSearchType] = useState("semantic");
  const [isOpen, setIsOpen] = useState({ filters: false, history: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading animation
    try {
      const response = await axios.post('http://129.213.131.75:5000/search', {
        input_idea: searchQuery,
        user_input_date: startDate.toISOString().split('T')[0],
      });
      setSearchResults(response.data['Granted results']); 
      saveSearchHistory(searchQuery, response.data['Granted results']);
    } catch (error) {
      alert("Search error: " + (error.response ? error.response.data.message : 'An error occurred'));
    }
    setLoading(false); // Stop loading animation when search is complete
  };
  
  const saveSearchHistory = async (query, results) => {
    const token = localStorage.getItem('token'); 
    try {
      await axios.post('http://129.213.131.75:5000/save_search', {
        query,
        results,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Save search history error:", error.response ? error.response.data : error);
    }
  };
  

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://129.213.131.75:5000/get_search_history', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHistory(response.data);
    } catch (error) {
      console.error("History fetch error:", error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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

  return (
    <div className="semantor-container">
       {loading && (
          <div className="loading-overlay">
            <BeatLoader color="#00b5ad" loading={loading} />
          </div>
        )}
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
            {history.length > 0 ? (
              history.map((item, index) => (
                <div key={index} className="history-item">
                  <span className="history-item-name">{item.query}</span>
                  <span className="history-item-date">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <div className="history-item">No search history found.</div>
            )}
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
            <input
              type="text"
              placeholder="Semantic / Keyword Search:"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" onClick={handleSearch} />
          </div>
          <br></br>

            {searchResults.map((result, index) => (
              <Result key={index} data={result} />
              
            ))}


            <PaginationControls></PaginationControls>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Semantor;