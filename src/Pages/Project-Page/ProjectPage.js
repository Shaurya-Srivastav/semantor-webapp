import React, { useState } from "react";
import { FaUser, FaHeart, FaSearch} from "react-icons/fa";
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";
import "./ProjectPage.css"


Modal.setAppElement('#root');


const Semantor = () => {

  const results = [
    { id: 1, title: "Card Title 1", summary: "Summary text for Card 1..." },
    { id: 2, title: "Card Title 2", summary: "Summary text for Card 2..." },
    { id: 3, title: "Card Title 3", summary: "Summary text for Card 3..." },
  ];
  
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
          <div className="sidebar-item"><a href="/History">History</a></div>
          <br></br>
          <div className="sidebar-item"><a href="/search">Back to Search....</a></div>
          <br />
          <div className="line"></div>
          <br />
          
        </aside>

        <main className="semantor-main">
          <h1 className="project-title">Projects: </h1>

          <div className="search-section">
            <div className="search-input">
              <input type="text" placeholder="Search...." />
              <FaSearch className="search-icon" />
            </div>
            <br></br>
            <br></br>

            <div className="result-box">
                {results.map(result => (
                <div className="card" key={result.id}>
                  <div className="card-header">{result.title}</div>
                  <div className="card-content">
                    <div className="card-text">{result.summary}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Semantor;
