import React, { useState, useEffect } from 'react';
import './SignUpPage.css';

const SignUpPage = () => {
  const [animationStage, setAnimationStage] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 500),
      setTimeout(() => setAnimationStage(2), 2000),
      setTimeout(() => setAnimationStage(3), 3500),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="signup-container">
      <div className={`animated-text ${animationStage >= 1 || showLogin ? 'enter' : ''}`}>
        <h1 className="title">SEMANTOR</h1>
      </div>
      {!showLogin && (
        <div className={`animated-text ${animationStage >= 2 ? 'enter' : ''}`}>
          <p className="subtitle">We search the world for you!</p>
        </div>
      )}
      <div className={`form-container ${animationStage === 3 || showLogin ? 'enter' : ''}`}>
        {showLogin ? (
          <>
            <h2 className="form-title">Login</h2>
            <form className="signup-form">
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button type="submit" className="signup-button">LOGIN</button>
              <p className="login-link" onClick={toggleForm}>Back to Sign Up</p>
            </form>
          </>
        ) : (
          <>
            <h2 className="form-title">Sign Up</h2>
            <form className="signup-form">
              <input type="text" placeholder="Full Name" />
              <input type="text" placeholder="Company" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <p>must be 8 or more characters and contain at least 1 number and 1 special character.</p>
              <button type="submit" className="signup-button">SIGN UP</button>
              <p className="login-link" onClick={toggleForm}>Already a user? LOGIN</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
