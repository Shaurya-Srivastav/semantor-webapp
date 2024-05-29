import React, { useState, useRef } from "react";
import "./Result.css";
import { FaHeart, FaRegHeart, FaFileDownload } from "react-icons/fa";
import Modal from "react-modal";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useLoading } from "../../../context/LoadingContext"; // Adjust the import path as needed

function Result({ data, userIdea }) {
  // State for modal, like button, and comparison results
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comparisonResult, setComparisonResult] = useState("");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const {
    isLoading,
    startLoading,
    stopLoading,
    loadingAction,
    loadingResultId,
  } = useLoading();

  // Unique identifier for this instance of Result, assuming data.patent_id is unique
  const resultId = data.patent_id;

  const displayOrDefault = (value, defaultMessage = "Not Found") =>
    value || defaultMessage;

  const [highlightResult, setHighlightResult] = useState({
    abstract: [],
    claims: [],
    summary: [],
  });
  const [highlightTriggered, setHighlightTriggered] = useState(false);

  const highlightSentences = async () => {
    startLoading("highlight", resultId);
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
      stopLoading(); // Stop loading regardless of the outcome
    }
  };

  const openCompareModal = async (e) => {
    e.preventDefault();
    startLoading("compare", resultId); // Notify that the 'compare' action is starting with this resultId

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://150.136.47.221:5000/compare-ideas",
        {
          userIdea: userIdea, // The user's idea for comparison
          patentIdea: data.abstract, // The abstract from the patent data
          patentId: data.patent_id,
          patentTitle: data.title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization token for the API
          },
        }
      );

      // Log and set the comparison result, then open the modal
      console.log("Comparison response:", response.data);
      setComparisonResult(response.data.comparison);
      setIsCompareModalOpen(true); // Open the modal to show the comparison results
    } catch (error) {
      // If there's an error, log it and set an error message
      console.error("Failed to compare ideas:", error);
      setComparisonResult(
        "Failed to fetch comparison. Please try again later."
      );
    } finally {
      stopLoading(); // Notify that the loading process has ended regardless of the outcome
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

  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const sendMessage = async () => {
  if (userMessage.trim() !== "") {
    const newMessage = {
      sender: "user",
      content: userMessage,
    };
    setChatMessages([...chatMessages, newMessage]);
    setUserMessage("");
    setIsChatLoading(true); // Set isChatLoading to true before sending the request

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://150.136.47.221:5000/chat",
        {
          patentId: data.patent_id,
          userMessage: newMessage.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const assistantMessage = {
        sender: "assistant",
        content: response.data.response,
      };
      setChatMessages([...chatMessages, newMessage, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        sender: "assistant",
        content: "Sorry, an error occurred. Please try again later.",
      };
      setChatMessages([...chatMessages, newMessage, errorMessage]);
    } finally {
      setIsChatLoading(false); // Set isChatLoading to false after receiving the response
    }
  }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
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
            <span className="search-result-number">US{data.patent_id}</span>
            <span className="search-result-number">{data.date}</span>
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
          <button
            className="search-result-action"
            onClick={openCompareModal}
            disabled={isLoading}
          >
            {isLoading &&
            loadingAction === "compare" &&
            loadingResultId === data.patent_id ? (
              <BeatLoader color="#00b5ad" size={10} />
            ) : (
              "DESCRIBE / COMPARE"
            )}
          </button>
          <button
            className="search-result-action"
            onClick={highlightSentences}
            disabled={isLoading}
          >
            {isLoading &&
            loadingAction === "highlight" &&
            loadingResultId === data.patent_id ? (
              <BeatLoader color="#00b5ad" size={10} />
            ) : (
              "HIGHLIGHT"
            )}
          </button>
          <button
            className="search-result-action"
            onClick={openChatModal}
            disabled={isLoading}
          >
            CHAT
          </button>
          {/* Other buttons don't have specific loading animations; they are just disabled during loading */}
          <button
            className="search-result-action"
            onClick={() => openGooglePatent(data.patent_id)}
            disabled={isLoading}
          >
            GOOGLE PATENT
          </button>
          {/* <button
            className="search-result-action"
            // If you have a handler for saving to project, add it here
            disabled={isLoading}
          >
            SAVE TO PROJECT
          </button> */}
          <button
            className="search-result-action"
            onClick={() => openUSPTO(data.patent_id)}
            disabled={isLoading}
          >
            USPTO
          </button>
        </div>
      </div>
      {/* Modal for Comparison Results */}
      <Modal
        isOpen={isCompareModalOpen} // Use the correct state variable for the comparison modal
        onRequestClose={() => setIsCompareModalOpen(false)} // When the modal is requested to close
        contentLabel="Comparison Results"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Comparison Results</h2>
        <div className="modal-content">
          {/* Render the comparison results here */}
          <ReactMarkdown remarkPlugins={[gfm]}>
            {comparisonResult}
          </ReactMarkdown>
        </div>
        <div className="modal-footer">
          <button
            onClick={() => setIsCompareModalOpen(false)} // Close the modal when the button is clicked
            className="close-button"
          >
            Close
          </button>
        </div>
      </Modal>
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
              ? data.abstract
                  .split(/(?<=\.)\s+|(?<=\.)$/)
                  .map((sentence, idx) => {
                    const highlight = highlightResult.highlights.abstract.some(
                      (highlightSentence) =>
                        sentence.includes(highlightSentence)
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
              ? data.claims
                  .split(/(?<=\.)\s+|(?<=\.)$/)
                  .map((sentence, idx) => {
                    const highlight = highlightResult.highlights.claims.some(
                      (highlightSentence) =>
                        sentence.includes(highlightSentence)
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
              ? data.summary
                  .split(/(?<=\.)\s+|(?<=\.)$/)
                  .map((sentence, idx) => {
                    const highlight = highlightResult.highlights.summary.some(
                      (highlightSentence) =>
                        sentence.includes(highlightSentence)
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

      <Modal
  isOpen={isChatModalOpen}
  onRequestClose={() => setIsChatModalOpen(false)}
  contentLabel="Chat Modal"
  className="modal chat-modal"
  overlayClassName="overlay"
>
        <h2>Chat with Patent {data.patent_id}</h2>
        <div className="chat-container">
          <div className="chat-messages">
            {/* Render chat messages here */}
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.sender === "user"
                    ? "user-message"
                    : "assistant-message"
                }`}
              >
                <div className="message-content">{message.content}</div>
              </div>
            ))}
            {isChatLoading && (
        <div className="chat-message assistant-message">
          <div className="message-content">
            <BeatLoader color="#00b5ad" size={10} />
          </div>
        </div>
      )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={() => setIsChatModalOpen(false)}
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
