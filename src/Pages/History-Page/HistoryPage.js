import React, { useState } from 'react';
import './HistoryPage.css';
import Sidebar from '../../Components/common/Sidebar/Sidebar';
import { FaHeart, FaRegHeart, FaFileDownload } from 'react-icons/fa';
import Result from '../../Components/common/Result/Result';
import Modal from 'react-modal';

Modal.setAppElement('#root');


function HistoryPage() {
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

  // Toggle tab activation
  const toggleTab = (tab) => {
    setActiveTabs(activeTabs.includes(tab) ? activeTabs.filter((t) => t !== tab) : [...activeTabs, tab]);
  };


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
  
    <div className="history-page">
      <Sidebar></Sidebar>
      <div id='content'>
        <h1>History</h1>
        <Result>
        </Result>
         
      </div>
    </div>
  );
}

export default HistoryPage;
