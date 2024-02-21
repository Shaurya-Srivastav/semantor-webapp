import React, { useState } from "react";
import "./SearchPage.css"; // Ensure this CSS file contains the styles provided
import { FaUser, FaHeart, FaCalendarAlt, FaSearch, FaChevronDown, FaChevronUp, FaRegHeart, FaInfo, FaExternalLinkAlt, FaFileDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";

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

  // Function to open the popup
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Function to close the popup
  const closeModal = () => {
    setModalIsOpen(false);
  };


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

  // Inside your component
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState('');

  const toggleLike = () => {
    setIsLiked(!isLiked); // Toggle the liked state

    // Trigger animation by adding the class
    setLikeAnimation('like-animation');

    // Remove the class after the animation ends (600ms in this case)
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
    // Implement file download logic here
    console.log('Download button clicked');
    // For example, you could trigger a download by creating an <a> element with the 'href' to your file URL and then clicking it programmatically
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
            <label>
              <input type="checkbox" /> Granted
            </label>
            <label>
              <input type="checkbox" /> Pregranted
            </label>
            {/* Submit button */}
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

            <div className="search-result">
              <div className="search-result-header">
                <button className="icon-heart-button" onClick={toggleLike}>
                  {isLiked ? <FaHeart className="icon-heart liked" /> : <FaRegHeart className="icon-heart" />}
                </button>
                <div className="search-result-title-section">
                  <h3 className="search-result-title">Semantor Advanced AI Search</h3>
                  <div className="search-result-subtitle">
                    <span>Author: John Doe</span>
                    <span>Assignee: XYZ Corporation</span>
                    <span>Filing Date: 01/01/2021</span>
                  </div>
                </div>

                <div className="search-result-meta">
                  <span className="search-result-number">#US285696</span>
                  <FaFileDownload className="icon-info" />
                  <button className="button-open" onClick={openModal}>OPEN</button>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Detail Modal"
                    className="modal"
                    overlayClassName="overlay"
                  >
                    <h2>Semantor Advanced AI Search</h2>
                    <div className="modal-content">
                      <p>Author: John Doe</p>
                      <p>Assignee: XYZ Corporation</p>
                      <p>Filing Date: 01/01/2021</p>
                      <button onClick={downloadFile} className="download-button">Download File</button>
                      <hr />
                      <h3>Abstract</h3>
                      <p>{/* Random text for abstract */}</p>
                      <h3>Detail</h3>
                      <p>{/* Random text for detail */}</p>
                      <h3>Claims</h3>
                      <p>{/* Random text for claims */}</p>
                      <h3>Summary</h3>
                      <p>{/* Random text for summary */}</p>
                    </div>
                    <div className="modal-footer">
                      <button onClick={closeModal} className="close-button">Close</button>
                    </div>

                  </Modal>
                </div>
              </div>
              <p className="search-result-description">
                {truncateText("insert the summary of the patent here it will be truncated to display 300 words. ", 300)}
              </p>
              <div className="search-result-actions">
                <button className="search-result-action">DESCRIBE/COMPARE</button>
                <button className="search-result-action">GOOGLE PATENT</button>
                <button className="search-result-action">SAVE TO PROJECT</button>
                <button className="search-result-action">USPTO</button>
              </div>
            </div>


            <div className="search-result">
              <div className="search-result-header">
                <button className="icon-heart-button" onClick={toggleLike}>
                  {isLiked ? <FaHeart className="icon-heart liked" /> : <FaRegHeart className="icon-heart" />}
                </button>
                <div className="search-result-title-section">
                  <h3 className="search-result-title">Semantor Advanced AI Search</h3>
                  <div className="search-result-subtitle">
                    <span>Author: John Doe</span>
                    <span>Assignee: XYZ Corporation</span>
                    <span>Filing Date: 01/01/2021</span>
                  </div>
                </div>

                <div className="search-result-meta">
                  <span className="search-result-number">#US285696</span>
                  <FaFileDownload className="icon-info" />
                  <button className="button-open" onClick={openModal}>OPEN</button>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Detail Modal"
                    className="modal"
                    overlayClassName="overlay"
                  >
                    <h2>Semantor Advanced AI Search</h2>
                    <div className="modal-content">
                      <p>Author: John Doe</p>
                      <p>Assignee: XYZ Corporation</p>
                      <p>Filing Date: 01/01/2021</p>
                      <button onClick={downloadFile} className="download-button">Download File</button>
                      <hr />
                      <h3>Abstract</h3>
                      <p>{/* Random text for abstract */}</p>
                      <h3>Detail</h3>
                      <p>{/* Random text for detail */}</p>
                      <h3>Claims</h3>
                      <p>{/* Random text for claims */}</p>
                      <h3>Summary</h3>
                      <p>{/* Random text for summary */}</p>
                    </div>
                    <div className="modal-footer">
                      <button onClick={closeModal} className="close-button">Close</button>
                    </div>

                  </Modal>
                </div>
              </div>
              <p className="search-result-description">
                {truncateText("insert the summary of the patent here it will be truncated to display 300 words. ", 300)}
              </p>
              <div className="search-result-actions">
                <button className="search-result-action">DESCRIBE/COMPARE</button>
                <button className="search-result-action">GOOGLE PATENT</button>
                <button className="search-result-action">SAVE TO PROJECT</button>
                <button className="search-result-action">USPTO</button>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Semantor;
