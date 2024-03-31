import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import "./SearchPage.css";
import {
  FaUser,
  FaHeart,
  FaCalendarAlt,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import PaginationControls from "../../Components/common/Pagination/PaginationControls";
import Result from "../../Components/common/Result/Result";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Semantor = () => {
  const [activeTabs, setActiveTabs] = useState([]);
  const [semanticQuery, setSemanticQuery] = useState("");
  const [indexSearchQuery, setIndexSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState({
    semantic: true,
    keyword: false,
  });

  const [isOpen, setIsOpen] = useState({ filters: false, history: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedHistoryResults, setSelectedHistoryResults] = useState([]);

  const [isKeywordSearchActive, setIsKeywordSearchActive] = useState(false);
  const [keywordSearchQuery, setKeywordSearchQuery] = useState("");
  const [displayDates, setDisplayDates] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ startDate: new Date(), endDate: new Date() });


  useEffect(() => {
    const textArea = document.querySelector(".search-input textarea");
    textArea.addEventListener("input", autoResize, false);

    function autoResize() {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    }

    textArea.addEventListener("focus", autoResize, false);
    textArea.addEventListener("blur", resetSize, false);

    function resetSize() {
      this.style.height = "40px"; // Set to default height of one line
    }

    // Clean up the event listeners when the component unmounts
    return () => {
      textArea.removeEventListener("input", autoResize, false);
      textArea.removeEventListener("focus", autoResize, false);
      textArea.removeEventListener("blur", resetSize, false);
    };
  }, []);

  const toggleSemanticSearch = () => {
    setSearchActive({ semantic: true, keyword: false });
  };

  const toggleSearchType = (type) => {
    setSearchActive((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleKeywordSearch = () => {
    setSearchActive((prevState) => ({
      ...prevState,
      keyword: !prevState.keyword,
    }));
  };

  const handleHistoryEntryClick = (historyEntryResults) => {
    const resultsArray =
      typeof historyEntryResults.results === "string"
        ? JSON.parse(historyEntryResults.results)
        : historyEntryResults.results;
    setSelectedHistoryResults(resultsArray);
    setSemanticQuery(historyEntryResults.query);
    setCurrentPage(1);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedResults =
    selectedHistoryResults.length > 0 ? selectedHistoryResults : searchResults;
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchHistory();
  }, []);


  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    setSelectedHistoryResults([]);

    let endpoint, requestData;

    if (searchActive.semantic && !searchActive.keyword) {
      // Only semantic search is active
      endpoint = "http://150.136.47.221:5000/search";
      requestData = {
        input_idea: semanticQuery,
        user_input_date: startDate.toISOString().split("T")[0],
        selected_indexes: activeTabs.length > 0 ? activeTabs : ["abstract", "claims", "summary"],
      };
    } else if (searchActive.semantic && searchActive.keyword) {
      // Both semantic and keyword searches are active
      endpoint = "http://150.136.47.221:5000/combined-search";
      requestData = {
        input_idea: semanticQuery,
        input_index: indexSearchQuery,
        user_input_date: startDate.toISOString().split("T")[0],
        selected_indexes: activeTabs.length > 0 ? activeTabs : ["abstract", "claims", "summary"],
      };
    } else {
      // If no valid search type is active, possibly due to a UI logic error
      console.error("No valid search type selected.");
      setLoading(false);
      return; // Stop execution
    }

    try {
      const response = await axios.post(endpoint, requestData);
      console.log(response.data["Granted results"]);
      setSearchResults(response.data["Granted results"]);
      saveSearchHistory(semanticQuery, response.data["Granted results"]);
      fetchHistory();
    } catch (error) {
      alert(
        "Search error: " +
        (error.response ? error.response.data.message : "An error occurred")
      );
    } finally {
      setLoading(false);
    }
  };


  const saveSearchHistory = async (query, results) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://150.136.47.221:5000/save_search",
        {
          query,
          results,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(
        "Save search history error:",
        error.response ? error.response.data : error
      );
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://150.136.47.221:5000/get_search_history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    setActiveTabs(
      activeTabs.includes(tab)
        ? activeTabs.filter((t) => t !== tab)
        : [...activeTabs, tab]
    );
  };

  const toggleDropdown = (dropdown) => {
    setIsOpen({ ...isOpen, [dropdown]: !isOpen[dropdown] });
  };

  const SidebarDropdown = ({ title, children, dropdownId }) => (
    <div className="sidebar-dropdown">
      <div
        className="sidebar-action"
        onClick={() => toggleDropdown(dropdownId)}
      >
        {title}
        {isOpen[dropdownId] ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isOpen[dropdownId] && <div className="dropdown-content">{children}</div>}
    </div>
  );

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    setStartDate(newStartDate);
    setSelectedDates(prev => ({ ...prev, startDate: newStartDate }));
  };

  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value);
    setEndDate(newEndDate);
    setSelectedDates(prev => ({ ...prev, endDate: newEndDate }));
  };


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
          <div className="user-dropdown">
            <FaUser className="user-icon" />
          </div>
          <FaHeart
            className="heart-icon"
            onClick={() => (window.location.href = "/project")}
          />
        </div>
      </header>

      <div className="semantor-body">
        <aside className="semantor-sidebar">
          <div className="sidebar-item">
            <a href="/project">Your Projects</a>
          </div>
          <br></br>
          <div className="sidebar-item">
            <a href="/history">Your history</a>
          </div>
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
            { }
            <button type="button" className="filter-submit-button">
              Apply Filters
            </button>
          </SidebarDropdown>
          <SidebarDropdown title="+ History" dropdownId="history">
            <div>Clear History...</div>
            {history.length > 0 ? (
              [...history].reverse().map((item, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryEntryClick(item)}
                >
                  <span className="history-item-name">{item.query}</span>
                  <div className="tooltip">{item.query}</div>
                  <span className="history-item-date">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="history-item">No search history found.</div>
            )}
          </SidebarDropdown>
        </aside>

        <main className="semantor-main">
          <nav className="semantor-nav">
            {["abstract", "claims", "summary"].map((tab) => (
              <button
                key={tab}
                className={`nav-button ${activeTabs.includes(tab) ? "active" : ""
                  }`}
                onClick={() => toggleTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="search-section">
            <div className="search-type-buttons">
              <button
                className={`search-type-button ${searchActive.semantic ? "active" : "active"
                  }`}
              >
                Semantic
              </button>

              <button
                className={`search-type-button ${searchActive.keyword ? "active" : ""
                  }`}
                onClick={() => toggleSearchType("keyword")}
              >
                Keyword
              </button>
            </div>

            {searchActive.semantic && (
              <div className="search-input">
                <FaCalendarAlt
                  className="calendar-icon"
                  onClick={() => {
                    setIsCalendarOpen(!isCalendarOpen);
                    if (!isCalendarOpen) {
                      // When opening the calendar, do nothing about displayDates
                      return;
                    }
                    // When closing the calendar, check if both dates are set
                    if (startDate && endDate) {
                      setDisplayDates(true);
                      setSelectedDates({ startDate, endDate });
                    } else {
                      setDisplayDates(false);
                    }
                  }}
                />

                {isCalendarOpen && (
                  <div className="date-picker">
                    <label htmlFor="start-date">
                      Start date:
                      <input
                        type="date"
                        id="start-date"
                        name="start-date"
                        value={selectedDates.startDate.toISOString().split('T')[0]}
                        onChange={handleStartDateChange}
                      />
                    </label>
                    <label htmlFor="end-date">
                      End date:
                      <input
                        type="date"
                        id="end-date"
                        name="end-date"
                        value={selectedDates.endDate.toISOString().split('T')[0]}
                        onChange={handleEndDateChange}
                      />
                    </label>
                  </div>
                )}
                <textarea
                  placeholder="Enter semantic search query..."
                  value={semanticQuery}
                  onChange={(e) => setSemanticQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && searchActive.semantic) {
                      handleSearch(e);
                    }
                  }}
                />
                <FaSearch
                  className="search-icon"
                  onClick={() => searchActive.semantic && handleSearch()}
                />
              </div>
            )}

            {displayDates && startDate && endDate && (
              <div className="selected-dates-display">
                Selected Date Range: {selectedDates.startDate.toDateString()} - {selectedDates.endDate.toDateString()}
              </div>
            )}

            {searchActive.keyword && (
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Enter keyword search query..."
                  value={indexSearchQuery}
                  onChange={(e) => setIndexSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && searchActive.keyword) {
                      handleSearch(e);
                    }
                  }}
                />

              </div>
            )}

            <br></br>
            <br></br>
            {isKeywordSearchActive && (
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Enter Specific Keywords: "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                />
              </div>
            )}

            <br></br>

            {displayedResults
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((result, index) => (
                <Result key={index} data={result} userIdea={semanticQuery} />
              ))}

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </main>

        <aside className={`sidebar-right ${isSidebarOpen ? "open" : ""}`}>
          <aside class="sidebar">
            <section class="sidebar-section">
              <h2 class="sidebar-title">Patent Assignee</h2>
              <ul class="sidebar-list">
                <li>Business Company</li>
                <li>Business Company</li>
                <li>Business Company</li>
                <li class="sidebar-more">20 MORE...</li>
              </ul>
            </section>

            <section class="sidebar-section">
              <h2 class="sidebar-title">Patent Inventor</h2>
              <ul class="sidebar-list">
                <li>Business Company</li>
                <li>Business Company</li>
                <li>Business Company</li>
                <li class="sidebar-more">20 MORE...</li>
              </ul>
            </section>

            <section class="sidebar-section">
              <h2 class="sidebar-title">Attorney Name</h2>
              <ul class="sidebar-list">
                <li>Business Company</li>
                <li>Business Company</li>
                <li>Business Company</li>
                <li class="sidebar-more">20 MORE...</li>
              </ul>
            </section>
          </aside>

          <div className="toggle-icon" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaChevronRight /> : <FaChevronLeft />}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Semantor;