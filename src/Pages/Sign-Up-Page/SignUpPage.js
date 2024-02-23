import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

const SignUpPage = () => {
  const [animationStage, setAnimationStage] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

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
    setFormErrors({}); 
  };

  const validateSignUpForm = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full Name is required";
    if (!company.trim()) errors.company = "Company is required";
    if (!signUpEmail) errors.signUpEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signUpEmail)) errors.signUpEmail = "Email address is invalid";
    if (!signUpPassword) errors.signUpPassword = "Password is required";
    else if (signUpPassword.length < 8 || !/\d/.test(signUpPassword) || !/[!@#$%^&*]/.test(signUpPassword)) {
      errors.signUpPassword = "Password must be 8 or more characters and contain at least 1 number and 1 special character.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
};

const validateLoginForm = () => {
  const errors = {};
  if (!loginEmail) errors.loginEmail = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(loginEmail)) errors.loginEmail = "Email address is invalid";
  if (!loginPassword) errors.loginPassword = "Password is required";
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateSignUpForm()) return;
    try {
      const response = await axios.post('http://129.213.131.75:5000/register', {
        username: signUpEmail,
        password: signUpPassword,
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.access_token);
      navigate('/search');
    } catch (error) {
      alert(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    try {
      const response = await axios.post('http://129.213.131.75:5000/login', {
        username: loginEmail,
        password: loginPassword,
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.access_token);
      navigate('/search');
    } catch (error) {
      alert(error.response ? error.response.data.message : 'An error occurred');
    }
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
            <form className="signup-form" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            {formErrors.loginEmail && <div className="error-message">{formErrors.loginEmail}</div>}

            <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            {formErrors.loginPassword && <div className="error-message">{formErrors.loginPassword}</div>}

            <button type="submit" className="signup-button">LOGIN</button>
            <p className="login-link" onClick={toggleForm}>Back to Sign Up</p>
          </form>

          </>
        ) : (
          <>
            <h2 className="form-title:">Sign Up</h2>
            <form className="signup-form" onSubmit={handleSignUp}>
            <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            {formErrors.fullName && <div className="error-message">{formErrors.fullName}</div>}

            <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
            {formErrors.company && <div className="error-message">{formErrors.company}</div>}

            <input type="email" placeholder="Email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
            {formErrors.signUpEmail && <div className="error-message">{formErrors.signUpEmail}</div>}

            <input type="password" placeholder="Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} />
            {formErrors.signUpPassword && <div className="error-message">{formErrors.signUpPassword}</div>}

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
