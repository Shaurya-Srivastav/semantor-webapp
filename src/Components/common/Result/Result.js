import React, { useState } from "react";
import "./Result.css";
import { FaHeart, FaRegHeart, FaFileDownload } from "react-icons/fa";
import Modal from "react-modal";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';


function Result({ data }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [comparisonResult, setComparisonResult] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const displayOrDefault = (value, defaultMessage = "Not Found") => value || defaultMessage;

  const openCompareModal = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loading animation
    setIsComparing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://129.213.131.75:5000/compare-ideas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        userIdea: "Your user's idea here", // You need to obtain the user's idea somehow
        patentIdea: data.abstract, // Using the patent's abstract for comparison
      });

      setComparisonResult(response.data.comparison);
    } catch (error) {
      console.error("Failed to compare ideas:", error);
      setComparisonResult("Failed to fetch comparison.");
    } finally {
      setIsComparing(false);
      setIsCompareModalOpen(true);
      setLoading(false); // Stop the loading animation
    }
  };

  
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
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }

  const downloadFile = (patentId) => {
    console.log("Download button clicked");
    const url = `https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/${patentId}`;
    window.open(url, "_blank");
  };

  const openGooglePatent = (patentId) => {
    const url = `https://patents.google.com/patent/US${patentId}/en`;
    window.open(url, "_blank");
  };

  function formatClaims(claimsText) {
    if (!claimsText) return []; // Ensure claimsText is not null or undefined
    const claimsArray = claimsText.split(" | ").map((claim, index) => {
      claim = claim
        .replace(/^\d+\.\s*/, "")
        .replace(/\s+/g, " ")
        .trim();
      return (
        <li key={index} style={{ marginBottom: "1em" }}>
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
            {isLiked ? (
              <FaHeart className="icon-heart liked" />
            ) : (
              <FaRegHeart className="icon-heart" />
            )}
          </button>
          <div className="search-result-title-section">
            <h3 className="search-result-title">{data.title}</h3>
          </div>
          <div className="search-result-meta">
            <span className="search-result-number">{data.patent_id}</span>
            <button className="icon-button" onClick={() => downloadFile(data.patent_id)}>
              <FaFileDownload />
            </button>
            <button className="button-open" onClick={openModal}>
              OPEN
            </button>
          </div>
        </div>
        <p className="search-result-description">{data.summary}</p>
        <div className="search-result-actions">
          <button className="search-result-action" onClick={openCompareModal}>
            {loading ? (
              <BeatLoader color="#00b5ad" loading={loading} size={10} />
            ) : (
              "DESCRIBE/COMPARE"
            )}
          </button>
          <button
            className="search-result-action"
            onClick={() => openGooglePatent(data.patent_id)}
          >
            GOOGLE PATENT
          </button>
          <button className="search-result-action">SAVE TO PROJECT</button>
          <button className="search-result-action">USPTO</button>
          <button className="search-result-action">Highlight</button>
        </div>
      </div>

      <Modal
        isOpen={isCompareModalOpen}
        onRequestClose={() => setIsCompareModalOpen(false)}
        style={{
          content: {
            maxWidth: "60%",
            maxHeight: "60%",
            margin: "auto",
            border: "2px solid #00b5ad",
            overflow: "auto",
          },
        }}
      >
        <h2>Why is Patent Related to Query?</h2>
        {isComparing ? (
          <p>Loading comparison...</p>
        ) : (
          <ReactMarkdown className="react-markdown" remarkPlugins={[gfm]}>
            {comparisonResult}
          </ReactMarkdown>

        )}
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detail Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{data.title}</h2>
        <div className="modal-content">
          <button onClick={() => downloadFile(data.patent_id)} className="download-button">
            Download File
          </button>
          <hr />
          {data.abstract && (
            <div>
              <h3>Abstract</h3>
              <p>{displayOrDefault(data.abstract)}</p>
            </div>
          )}
          {data.claims && (
            <div>
              <h3>Claims</h3>
              <ul>{claimsListItems.length > 0 ? claimsListItems : <li>{displayOrDefault(null)}</li>}</ul>
            </div>
          )}
          {data.summary && (
            <div>
              <h3>Summary</h3>
              <p>{displayOrDefault(data.summary)}</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={closeModal} className="close-button">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Result;
