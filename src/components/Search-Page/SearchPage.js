import React from 'react';
import './SearchPage.css'; // Make sure your CSS file is named accordingly

const SearchPage = () => {
  return (
    <div className="search-page">
      <header className="search-header">
        <h1 className="search-logo">SEMANTOR</h1>
        <nav className="search-nav">
          <a href="/projects" className="nav-item">Your project</a>
          <a href="/history" className="nav-item">Your history</a>
          <a href="/favorites" className="nav-item">Your favorite</a>
          {/* Add more nav items if needed */}
        </nav>
        <div className="user-profile">
          <button className="profile-button">Profile</button>
          <button className="favorites-button">Favorites</button>
        </div>
      </header>
      <main className="main-content">
        <aside className="sidebar">
          <button className="filter-button">+ Filters</button>
          <button className="history-button">+ History</button>
        </aside>
        <div className="search-bar">
          <div className="search-buttons">
            <button className="search-type-button active">Semantic</button>
            <button className="search-type-button">Keyword</button>
          </div>
          <label htmlFor="search" className="search-label">Semantic / Keyword Search:</label>
          <div className="search-input">
            <input type="text" id="search" placeholder="Start typing..." />
            <button className="search-icon-button">
              <span className="search-icon"></span>
              <span className="search-text">Search</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
