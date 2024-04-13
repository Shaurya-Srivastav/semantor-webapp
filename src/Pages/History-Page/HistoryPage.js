import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import "./HistoryPage.css";
import { FaUser, FaHeart, FaCalendarAlt, FaSearch, FaChevronDown, FaChevronUp, FaSignOutAlt } from "react-icons/fa";
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";
import PaginationControls from "../../Components/common/Pagination/PaginationControls";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

Modal.setAppElement('#root');

const Semantor = () => {
  const { logout } = useAuth();
  const [activeTabs, setActiveTabs] = useState([]);
  const [isOpen, setIsOpen] = useState({ filters: false, history: false });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState([]);

  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [displayDates, setDisplayDates] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await axios.get("http://150.136.47.221:5000/get_search_history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parsedHistory = response.data.map(item => ({
        ...item,
        results: JSON.parse(item.results)
      }));
      setSearchHistory(parsedHistory);
      setFilteredHistory(parsedHistory);
      console.log(parsedHistory)
    } catch (error) {
      console.error("Failed to fetch search history:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const openConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(false);
  };

  const deleteEntireHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://150.136.47.221:5000/clear_search_history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchHistory([]);
      setFilteredHistory([]);
      closeConfirmDeleteModal();
    } catch (error) {
      console.error("Failed to delete entire history:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filterSearchHistory = (history, term) => {
    if (!term) {
      return history;
    }
    const lowerCaseTerm = term.toLowerCase();
    return history.filter((item) =>
      item.query.toLowerCase().includes(lowerCaseTerm)
    );
  };

  const applyFilters = () => {
    if (filterStartDate && filterEndDate) {
      // Filter the searchHistory based on the date range
      const filteredResults = searchHistory.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= filterStartDate && itemDate <= filterEndDate;
      });

      if (filteredResults.length === 0) {
        // Alert the user that no history is found
        alert("No history found for the selected date range.");
      } else {
        // There are results, update the state to display them
        setFilteredHistory(filteredResults);
        setCurrentPage(1); // Reset to the first page after filtering
      }
    } else {
      alert('Please select both start and end dates to apply filters.');
    }
  };

  const resetFilter = () => {
    // Reset the date filters to null or initial values
    setFilterStartDate(null);
    setFilterEndDate(null);
    setSelectedDates({ startDate: null, endDate: null });
    setDisplayDates(false);

    // Reset the filteredHistory to the original search history
    setFilteredHistory(searchHistory);

    // Set the current page back to the first page
    setCurrentPage(1);
  };

  const filteredSearchHistory = filterSearchHistory(searchHistory, searchTerm);
  const totalPages = Math.ceil(filteredSearchHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedHistory = filteredSearchHistory.slice(startIndex, endIndex);

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    setFilterStartDate(newStartDate);
    setSelectedDates(prev => ({ ...prev, startDate: newStartDate }));
  };

  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value);
    setFilterEndDate(newEndDate);
    setSelectedDates(prev => ({ ...prev, endDate: newEndDate }));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="semantor-container">
      {loading && (
        <div className="loading-overlay">
          <BeatLoader color="#00b5ad" loading={loading} />
        </div>
      )}
      <header className="semantor-header">
        <h1><a href="/search">SEMANTOR.AI</a></h1>
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

            {displayDates && filterStartDate && filterEndDate && (
              <div className="selected-dates-display">
                Selected Date Range: {selectedDates.startDate.toDateString()} - {selectedDates.endDate.toDateString()}
              </div>
            )}
            <button type="button" className="filter-submit-button" onClick={applyFilters}>
              Apply Filters
            </button>
            <button type="button" className="filter-submit-button" onClick={resetFilter}>
              Reset Filters
            </button>
          </SidebarDropdown>
          <button
            type="button"
            className="clear-history-button"
            onClick={openConfirmDeleteModal}
          >
            Clear History
          </button>
        </aside>

        <main className="semantor-main">
          <h1 className="project-title">Search History</h1>

          <div className="search-section">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <br></br>
            <br></br>

            <div className="history-items-container">
              {displayedHistory.map((historyItem, index) => (
                <div key={historyItem.id} className="search-result" onClick={() => handleHistoryItemClick(historyItem)}>
                  <div className="search-result-header">
                    <div className="search-result-title-section">
                      <h2 className="search-result-title">{truncateText(historyItem.query, 10)}</h2>
                      <div className="search-result-subtitle">
                        <span>{historyItem.timestamp}</span>
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

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}

          </div>
        </main>
      </div>

      <ConfirmDeleteModal
        isOpen={confirmDeleteModalOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={deleteEntireHistory}
      />
    </div>
  );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel="Confirm Delete"
    className="confirm-delete-modal"
  >
    <div className="modal-buttons">
    <h2>Are you sure you want to delete your entire history?</h2>
      <button onClick={onConfirm}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  </Modal>
);

export default Semantor;