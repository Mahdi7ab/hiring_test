import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(''); // Clear previous server errors

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID);
      onLogin();
      navigate('/play');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setServerError('User not found. Please register first.');
      } else {
        setServerError(error.response?.data.message || 'Error logging in');
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
          />
          {errors.username && <span className={styles.error}>{errors.username}</span>}
        </div>
        <div className={styles.formGroup}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={`${styles.button} ${styles.loginButton}`}>
            Login
          </button>
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className={`${styles.button} ${styles.registerButton}`}
          >
            Register
          </button>
        </div>
        {serverError && <p className={styles.serverError}>{serverError}</p>}
      </form>
    </div>
  );
};

export default Login;