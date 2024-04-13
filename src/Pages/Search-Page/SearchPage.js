import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import "./SearchPage.css";
import {
  FaSignOutAlt,
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
import { useAuth } from "../../context/AuthContext";
import { useLocation } from 'react-router-dom';

Modal.setAppElement("#root");

const Semantor = () => {
  const [isStartDateFocused, setIsStartDateFocused] = useState(false);
  const [isEndDateFocused, setIsEndDateFocused] = useState(false);

  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [effectiveTotalPages, setEffectiveTotalPages] = useState(0);

  const { logout } = useAuth();
  const [activeTabs, setActiveTabs] = useState(["abstract", "claims", "summary"]);
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
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedHistoryResults, setSelectedHistoryResults] = useState([]);

  const [isKeywordSearchActive, setIsKeywordSearchActive] = useState(false);
  const [keywordSearchQuery, setKeywordSearchQuery] = useState("");
  const [displayDates, setDisplayDates] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ startDate: new Date(), endDate: new Date() });
  const [unfilteredResults, setUnfilteredResults] = useState([]);

  const location = useLocation();
  const historyItem = location.state && location.state.historyItem;

  useEffect(() => {
    if (historyItem) {
      setSearchResults(historyItem.results);
      setSemanticQuery(historyItem.query);
      setHasSearched(true);
      setEffectiveTotalPages(Math.ceil(historyItem.results.length / itemsPerPage));
    }
  }, [historyItem]);

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
    setUnfilteredResults(resultsArray); // Save the history entry results as unfiltered results
    setSearchResults(resultsArray); // Set the main search results to the history entry
    setSelectedHistoryResults(resultsArray); // Also set the selected history results to the same
    setSemanticQuery(historyEntryResults.query);
    setCurrentPage(1);

    // Update the total pages in case the history results have a different length than the current searchResults
    setEffectiveTotalPages(Math.ceil(resultsArray.length / itemsPerPage));

    // Since we're loading history, we should indicate that a search has been done
    setHasSearched(true);

    // Optionally, re-apply filters if they are set, or clear them if they are not
    if (filterStartDate && filterEndDate) {
      applyFilters();
    } else {
      // If no filters are set, we display the unfiltered history results
      setSearchResults(resultsArray);
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedResults =
    selectedHistoryResults.length > 0 ? selectedHistoryResults : searchResults;
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  useEffect(() => {
    setEffectiveTotalPages(Math.ceil(displayedResults.length / itemsPerPage));
  }, [displayedResults]); // This effect updates effectiveTotalPages whenever displayedResults change


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchHistory();
  }, []);


  const handleSearch = async (e) => {
    // Only call preventDefault if the event object is provided
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    // Trim both queries to remove leading/trailing whitespace
    const trimmedSemanticQuery = semanticQuery.trim();
    const trimmedKeywordSearchQuery = indexSearchQuery.trim();

    // Check if both queries are empty after trimming
    if (!trimmedSemanticQuery && (!searchActive.keyword || !trimmedKeywordSearchQuery)) {
      // If so, just return without doing anything
      return;
    }

    setCurrentPage(1);
    setHasSearched(true); // Add this line to set the flag when search is triggered
    setLoading(true);
    setSelectedHistoryResults([]);

    let endpoint, requestData;

    if (searchActive.semantic && !searchActive.keyword) {
      // Prepare request for only semantic search
      endpoint = "http://150.136.47.221:5000/search";
      requestData = {
        input_idea: trimmedSemanticQuery,
        user_input_date: startDate.toISOString().split("T")[0],
        selected_indexes: activeTabs.length > 0 ? activeTabs : ["abstract", "claims", "summary"],
      };
    } else if (searchActive.semantic && searchActive.keyword) {
      // Prepare request for combined search
      endpoint = "http://150.136.47.221:5000/combined-search";
      requestData = {
        input_idea: trimmedSemanticQuery,
        input_index: trimmedKeywordSearchQuery,
        user_input_date: startDate.toISOString().split("T")[0],
        selected_indexes: activeTabs.length > 0 ? activeTabs : ["abstract", "claims", "summary"],
      };
    } else {
      console.error("No valid search type selected.");
      setLoading(false);
      return; // Stop execution if no valid search type is active
    }

    try {
      const response = await axios.post(endpoint, requestData);
      console.log(response.data["Granted results"]);
      setSearchResults(response.data["Granted results"]);
      setUnfilteredResults(response.data["Granted results"]); // Set unfiltered results here after a new search
      await saveSearchHistory(trimmedSemanticQuery, response.data["Granted results"]);
      setLoading(false);
      await fetchHistory();
    } catch (error) {
      alert("Search error: " + (error.response ? error.response.data.message : "An error occurred"));
    } finally {
      setEffectiveTotalPages(Math.ceil(searchResults.length / itemsPerPage));
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
    setLoadingHistory(true); // Start loading
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
    } finally {
      setLoadingHistory(false); // End loading
    }
  };

  const clearHistory = async () => {
    setLoadingHistory(true); // Optionally, start loading indication
    try {
      const token = localStorage.getItem("token");
      // Send a request to the server endpoint to clear the search history
      await axios.delete("http://150.136.47.221:5000/clear_search_history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming the history is cleared successfully on the server, you might want to update the UI accordingly
      // For example, by clearing the history array in the state
      setHistory([]);
      alert("Search history cleared successfully."); // Provide feedback to the user
    } catch (error) {
      console.error("Error clearing history:", error);
      alert("Failed to clear search history."); // Provide error feedback to the user
    } finally {
      setLoadingHistory(false); // Optionally, end loading indication
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
    setActiveTabs((currentTabs) => {
      // Check if the current tab is active and it's the only one active
      if (currentTabs.includes(tab) && currentTabs.length === 1) {
        // Do not allow unselecting the last active tab
        return currentTabs;
      } else if (currentTabs.includes(tab)) {
        // If the tab is currently active, filter it out
        return currentTabs.filter((t) => t !== tab);
      } else {
        // If the tab is not active, add it to the array of active tabs
        return [...currentTabs, tab];
      }
    });
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

  const applyFilters = () => {
    if (filterStartDate && filterEndDate) {
      // Filter the displayedResults based on the date range
      const filteredResults = displayedResults.filter((result) => {
        const resultDate = new Date(result.date); // Ensure your result objects contain a 'date' property
        return resultDate >= filterStartDate && resultDate <= filterEndDate;
      });

      if (filteredResults.length === 0) {
        // Alert the user that no patents are found
        alert("No patents found for the selected date range.");
      } else {
        // There are results, update the state to display them
        setSearchResults(filteredResults); // Now updating searchResults
        setSelectedHistoryResults(filteredResults); // Also update the selectedHistoryResults to keep consistency
        setEffectiveTotalPages(Math.ceil(filteredResults.length / itemsPerPage));
        setCurrentPage(1); // Reset to the first page after filtering
        setHasSearched(true); // Indicate that a search has been performed
      }
    } else {
      alert('Please select both start and end dates to apply filters.');
    }
  };

  const resetFilter = () => {
    // Reset the date filters to null or initial values
    setFilterStartDate(null);
    setFilterEndDate(null);
  
    // Check if there is a history item
    if (historyItem) {
      // If there is a history item, reset the search results to the history item's results
      setSearchResults(historyItem.results);
    } else {
      // If there is no history item, reset the search results to the unfiltered results
      setSearchResults(unfilteredResults);
    }
  
    // Since we are resetting to unfiltered results, we clear the selected history results
    setSelectedHistoryResults([]);
  
    // Reset the effective total pages based on the reset search results
    setEffectiveTotalPages(Math.ceil((historyItem ? historyItem.results : unfilteredResults).length / itemsPerPage));
  
    // Set the current page back to the first page
    setCurrentPage(1);
  
    // Additionally, if you are displaying the date range, you might want to reset that display
    setDisplayDates(false);
  };




  return (
    <div className="semantor-container">
      {loading && (
        <div className="loading-overlay">
          <BeatLoader color="#00b5ad" loading={loading} />
        </div>
      )}

      <header className="semantor-header">
        <h1>SEMANTOR.AI</h1>
        <div className="semantor-user-icons">
          <div className="user-dropdown" onClick={logout}>
            <FaSignOutAlt className="user-icon" />
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
              <input
                type="date"
                name="start-date"
                value={filterStartDate ? filterStartDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setFilterStartDate(new Date(e.target.value));
                  } else {
                    setFilterStartDate(null);
                  }
                }}
                onKeyDown={(e) => e.preventDefault()} // Block typing
              />
            </label>
            <label>
              End date:
              <input
                type="date"
                name="end-date"
                value={filterEndDate ? filterEndDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setFilterEndDate(new Date(e.target.value));
                  } else {
                    setFilterEndDate(null);
                  }
                }}
                onKeyDown={(e) => e.preventDefault()} // Block typing
              />
            </label>
            <button type="button" className="filter-submit-button" onClick={applyFilters}>
              Apply Filters
            </button>
            <button type="button" className="filter-submit-button" onClick={resetFilter}>
              Reset Filters
            </button>
          </SidebarDropdown>


          <SidebarDropdown title="+ History" dropdownId="history">
            <div onClick={clearHistory} style={{ cursor: 'pointer' }}>
              Clear History...
            </div>
            {loadingHistory ? (
              <div className="loading-history">
                <br></br>
                <BeatLoader color="#00b5ad" loading={loadingHistory} />
              </div>
            ) : history.length > 0 ? (
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

            {
              hasSearched && displayedResults.length === 0 ? (
                <p>No results found for the selected date range.</p>
              ) : (
                displayedResults
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((result, index) => <Result key={index} data={result} userIdea={semanticQuery} />)
              )
            }
            {effectiveTotalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={effectiveTotalPages}
                onPageChange={onPageChange}
              />
            )}


          </div>
        </main>

        <aside className={`sidebar-right ${isSidebarOpen ? "open" : ""}`}>
          <aside className="sidebar">
            <section className="sidebar-section">
              <h2 className="sidebar-title">Patent Assignee</h2>
              <ul className="sidebar-list">
                <li>Business Company</li>
                <li>Business Company</li>
                <li>Business Company</li>
                <li className="sidebar-more">20 MORE...</li>
              </ul>
            </section>

            <section className="sidebar-section">
              <h2 className="sidebar-title">Patent Inventor</h2>
              <ul className="sidebar-list">
                <li>Business Company</li>
                <li>Business Company</li>
                <li>Business Company</li>
                <li className="sidebar-more">20 MORE...</li>
              </ul>
            </section>

            <section className="sidebar-section">
              <h2 className="sidebar-title">Attorney Name</h2>
              <ul className="sidebar-list">
                <li>Business Company</li>
                <li>Business Company</li>
                <li>Business Company</li>
                <li className="sidebar-more">20 MORE...</li>
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