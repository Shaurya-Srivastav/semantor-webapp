import React, { useState } from "react";
import "./Result.css";
import { FaHeart, FaRegHeart, FaFileDownload } from "react-icons/fa";
import Modal from "react-modal";

function Result({ data }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  function truncateText(text, wordLimit) {
    if (!text) return ""; // Ensure text is not null or undefined
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  }

  const downloadFile = () => {
    console.log("Download button clicked");
    // Implement file download functionality here
  };

  const openGooglePatent = (patentId) => {
    const url = `https://patents.google.com/patent/US${patentId}/en`;;
    window.open(url, '_blank');
  };

  function formatClaims(claimsText) {
    if (!claimsText) return []; // Ensure claimsText is not null or undefined
    const claimsArray = claimsText.split(' | ').map((claim, index) => {
      claim = claim.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' ').trim();
      return (
        <li key={index} style={{ marginBottom: '1em' }}>
          <strong>Claim {index + 1}:</strong> {claim}
        </li>
      );
    });
    return claimsArray;
  }

  const claimsListItems = formatClaims(data.claims);

  return (
    <div>
      <div className="search-result">
        <div className="search-result-header">
          <button className="icon-heart-button" onClick={toggleLike}>
            {isLiked ? <FaHeart className="icon-heart liked" /> : <FaRegHeart className="icon-heart" />}
          </button>
          <div className="search-result-title-section">
            <h3 className="search-result-title">{data.title}</h3>
          </div>
          <div className="search-result-meta">
            <span className="search-result-number">{data.patent_id}</span>
            <button className="icon-button" onClick={downloadFile}>
              <FaFileDownload />
            </button>
            <button className="button-open" onClick={openModal}>OPEN</button>
          </div>
        </div>
        <p className="search-result-description">{data.summary}</p>
        <div className="search-result-actions">
          <button className="search-result-action">DESCRIBE/COMPARE</button>
          <button 
          className="search-result-action" 
          onClick={() => openGooglePatent(data.patent_id)}
        >GOOGLE PATENT</button>
          <button className="search-result-action">SAVE TO PROJECT</button>
          <button className="search-result-action">USPTO</button>
          <button className="search-result-action">Highlight</button>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Detail Modal" className="modal" overlayClassName="overlay">
        <h2>{data.title}</h2>
        <div className="modal-content">
          <button onClick={downloadFile} className="download-button">Download File</button>
          <hr />
          {data.abstract && (
            <div>
              <h3>Abstract</h3>
              <p>{data.abstract}</p>
            </div>
          )}
          {data.claims && (
            <div>
              <h3>Claims</h3>
              <ul>{claimsListItems}</ul>
            </div>
          )}
          {data.summary && (
            <div>
              <h3>Summary</h3>
              <p>{data.summary}</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={closeModal} className="close-button">Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default Result;