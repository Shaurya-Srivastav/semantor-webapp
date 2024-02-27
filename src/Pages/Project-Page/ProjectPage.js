import React, { useState } from "react";
import { FaUser, FaHeart, FaSearch } from "react-icons/fa";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import "./ProjectPage.css";
import Result from "../../Components/common/Result/Result";

Modal.setAppElement("#root");

const Semantor = () => {
  const results = [
    { id: 1, title: "Card Title 1", summary: "Summary text for Card 1..." },
    { id: 2, title: "Card Title 2", summary: "Summary text for Card 2..." },
    { id: 3, title: "Card Title 3", summary: "Summary text for Card 3..." },
  ];

  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarProjects, setSidebarProjects] = useState([]);
  const [searchType, setSearchType] = useState("semantic");
  const nonSelectedProjects = results.filter(p => p.id !== selectedProject?.id);
  const [hasSelectedProject, setHasSelectedProject] = useState(false);

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setHasSelectedProject(true);
    // Add more logic if needed
  };

  const clearSelection = () => {
    setSelectedProject(null);
    setHasSelectedProject(false);
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
          <div className="sidebar-item">
            <a href="/History">History</a>
          </div>
          <br></br>
          <div className="sidebar-item">
            <a href="/search">Back to Search....</a>
          </div>
          <br />
          <div className="line"></div>
          <br />
          <button className="add-project-btn">
            Add Project
          </button>

          {hasSelectedProject && (
            <>
              <button className="back-button" onClick={clearSelection}>
                Back to all projects
              </button>
              <div className="sidebar-title">Projects</div>
              {nonSelectedProjects.map(project => (
                <div key={project.id} className="sidebar-project-item" onClick={() => handleCardClick(project)}>
                  {project.title}
                </div>
              ))}
            </>
          )}


        </aside>

        <main className="semantor-main">
          {selectedProject ? (
            <>
              <h1 className="project-title">{selectedProject.title}</h1>
              <div className="search-section">
                <div className="search-type-buttons">
                  <button
                    className={`search-type-button ${searchType === "semantic" ? "active" : ""
                      }`}
                    onClick={() => setSearchType("semantic")}
                  >
                    Semantic
                  </button>
                  <button
                    className={`search-type-button ${searchType === "keyword" ? "active" : ""
                      }`}
                    onClick={() => setSearchType("keyword")}
                  >
                    Keyword
                  </button>
                </div>

                <div className="search-input">
                  <input type="text" placeholder="Search...." onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // handleSearch(e);
                    }
                  }} />
                  <FaSearch className="search-icon" />
                </div>
                {/* ...render the selected project's results here using result components... */}
              </div>
            </>
          ) : (
            <>
              <h1 className="project-title">Projects:</h1>
              <div className="result-box">
                {results.map((result) => (
                  <div
                    className="card"
                    key={result.id}
                    onClick={() => handleCardClick(result)}
                  >
                    <div className="card-header">{result.title}</div>
                    <div className="card-content">
                      <div className="card-text">{result.summary}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Semantor;
