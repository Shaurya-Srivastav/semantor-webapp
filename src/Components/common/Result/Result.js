import React, { useState } from "react";
import "./Result.css";
import { FaHeart, FaRegHeart, FaFileDownload } from "react-icons/fa";
import Modal from 'react-modal';

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
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  }

  const downloadFile = () => {
    console.log('Download button clicked');
    // Implement file download functionality here
  };

  return (
    <div>
      <div className="search-result">
        <div className="search-result-header">
          <button className="icon-heart-button" onClick={toggleLike}>
            {isLiked ? <FaHeart className="icon-heart liked" /> : <FaRegHeart className="icon-heart" />}
          </button>
          <div className="search-result-title-section">
            <h3 className="search-result-title">{data.title}</h3>
            <div className="search-result-subtitle">
              <span>Author: {data.author}</span>
              <span>Assignee: {data.assignee}</span>
              <span>Filing Date: {data.filingDate}</span>
            </div>
          </div>
          <div className="search-result-meta">
            <span className="search-result-number">{data.patentNumber}</span>
            <button className="icon-button" onClick={downloadFile}>
              <FaFileDownload />
            </button>
            <button className="button-open" onClick={openModal}>OPEN</button>
          </div>
        </div>
        <p className="search-result-description">
          {truncateText(data.summary, 300)}
        </p>
        <div className="search-result-actions">
          <button className="search-result-action">DESCRIBE/COMPARE</button>
          <button className="search-result-action">GOOGLE PATENT</button>
          <button className="search-result-action">SAVE TO PROJECT</button>
          <button className="search-result-action">USPTO</button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detail Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{data.title}</h2>
        <div className="modal-content">
          <p>Author: {data.author}</p>
          <p>Assignee: {data.assignee}</p>
          <p>Filing Date: {data.filingDate}</p>
          <button onClick={downloadFile} className="download-button">Download File</button>
          <hr />
          <h3>Abstract</h3>
          <p>{data.abstract}</p>
          <h3>Detail</h3>
          <p>{data.detail}</p>
          <h3>Claims</h3>
          <p>{data.claims}</p>
          <h3>Summary</h3>
          <p>{data.summary}</p>
        </div>
        <div className="modal-footer">
          <button onClick={closeModal} className="close-button">Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default Result;
