import React, { useState } from "react";
import "./Result.css";
import { FaHeart, FaRegHeart, FaFileDownload } from "react-icons/fa";
import Modal from "react-modal";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

function Result({ data, userIdea }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [comparisonResult, setComparisonResult] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const displayOrDefault = (value, defaultMessage = "Not Found") =>
    value || defaultMessage;

  const [highlightResult, setHighlightResult] = useState({
    abstract: [],
    claims: [],
    summary: [],
  });
  const [highlightTriggered, setHighlightTriggered] = useState(false);

  const highlightSentences = async () => {
    setLoading(true);
    setHighlightTriggered(false); // Reset this flag each time the function is called
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://150.136.47.221:5000/highlight",
        {
          patentText: data,
          inputIdea: userIdea,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHighlightResult(response.data);
      setHighlightTriggered(true); // Set to true only on successful highlight fetch
      openModal(); // Open the modal to show the results
    } catch (error) {
      console.error("Failed to highlight sentences:", error);
      setHighlightResult({ abstract: [], claims: [], summary: [] }); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  const openCompareModal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsComparing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://150.136.47.221:5000/compare-ideas",
        {
          userIdea: userIdea, // Assuming this is correct
          patentIdea: data.abstract, // Assuming this is the intended comparison
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Comparison response:", response.data); // Debugging log
      setComparisonResult(response.data.comparison);
      setIsCompareModalOpen(true); // Ensure this is set to true
    } catch (error) {
      console.error("Failed to compare ideas:", error);
      setComparisonResult("Failed to fetch comparison.");
    } finally {
      setIsComparing(false);
      setLoading(false);
    }
  };


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setHighlightTriggered(false);
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
  const openUSPTO = (patentId) => {
    const url = `https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/${patentId}`;
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
            <a
              href={`https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/${data.patent_id}`}
              target="_blank"
              className="icon-button"
            >
              <FaFileDownload />
            </a>

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
          <button className="search-result-action" onClick={() => openUSPTO(data.patent_id)}>USPTO</button>
          <button className="search-result-action" onClick={highlightSentences}>
            {loading ? (
              <BeatLoader color="#00b5ad" loading={loading} size={10} />
            ) : (
              "HIGHLIGHT"
            )}
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          closeModal();
          setHighlightTriggered(false);
        }}
        contentLabel="Detail Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{data.title}</h2>
        <div className="modal-content">
          <button
            onClick={() => downloadFile(data.patent_id)}
            className="download-button"
          >
            Download File
          </button>
          <hr />
          {/* Abstract Section */}
          <h3>Abstract</h3>
          <p>
            {highlightTriggered
              ? data.abstract.split(/(?<=\.)\s+|(?<=\.)$/).map((sentence, idx) => {
                const highlight = highlightResult.highlights.abstract.some(
                  (highlightSentence) => sentence.includes(highlightSentence)
                );
                return highlight ? (
                  <span key={idx} style={{ backgroundColor: "yellow" }}>
                    {sentence}{" "}
                  </span>
                ) : (
                  <span key={idx}>{sentence}. </span>
                );
              })
              : displayOrDefault(data.abstract)}
          </p>
          {/* Claims Section */}
          <h3>Claims</h3>
          <p>
            {highlightTriggered
              ? data.claims.split(/(?<=\.)\s+|(?<=\.)$/).map((sentence, idx) => {
                const highlight = highlightResult.highlights.claims.some(
                  (highlightSentence) => sentence.includes(highlightSentence)
                );
                return highlight ? (
                  <span key={idx} style={{ backgroundColor: "yellow" }}>
                    {sentence}{" "}
                  </span>
                ) : (
                  <span key={idx}>{sentence}. </span>
                );
              })
              : displayOrDefault(data.claims)}
          </p>
          {/* Summary Section */}
          <h3>Summary</h3>
          <p>
            {highlightTriggered
              ? data.summary.split(/(?<=\.)\s+|(?<=\.)$/).map((sentence, idx) => {
                const highlight = highlightResult.highlights.summary.some(
                  (highlightSentence) => sentence.includes(highlightSentence)
                );
                return highlight ? (
                  <span key={idx} style={{ backgroundColor: "yellow" }}>
                    {sentence}{" "}
                  </span>
                ) : (
                  <span key={idx}>{sentence}. </span>
                );
              })
              : displayOrDefault(data.summary)}
          </p>
        </div>
        <div className="modal-footer">
          <button
            onClick={() => {
              closeModal();
              setHighlightTriggered(false);
            }}
            className="close-button"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Result;
