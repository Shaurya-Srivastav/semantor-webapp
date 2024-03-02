// App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import withAuthProtection from './auth/withAuthProtection'; // Ensure this path is correct
import SignUpPage from './Pages/Sign-Up-Page/SignUpPage';
import SearchPage from './Pages/Search-Page/SearchPage';
import HistoryPage from './Pages/History-Page/HistoryPage';
import ProjectPage from './Pages/Project-Page/ProjectPage';

// Wrap your components with the HOC to protect them
const SearchPageProtected = withAuthProtection(SearchPage);
const HistoryPageProtected = withAuthProtection(HistoryPage);
const ProjectPageProtected = withAuthProtection(ProjectPage);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SignUpPage />} />
            <Route path="/search" element={<SearchPageProtected />} />
            <Route path="/history" element={<HistoryPageProtected />} />
            <Route path="/project" element={<ProjectPageProtected />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
