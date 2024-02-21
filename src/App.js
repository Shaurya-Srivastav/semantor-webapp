import './App.css';
import React from 'react';
import SignUpPage from './components/Sign-Up-Page/SignUpPage';
import SearchPage from './components/Search-Page/SearchPage';
import HistoryPage from './components/History-Page/HistoryPage';

function App() {
  return (
    <div className="App">
      {/*<SignUpPage />*/}
      {/* <SearchPage /> */}
      <HistoryPage />
    </div>
  );
}

export default App;
