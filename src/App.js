import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './Pages/Sign-Up-Page/SignUpPage';
import SearchPage from './Pages/Search-Page/SearchPage';
import HistoryPage from './Pages/History-Page/HistoryPage';
import ProjectPage from './Pages/Project-Page/ProjectPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
