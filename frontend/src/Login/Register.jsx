import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate for navigation
import axios from 'axios';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [serverMessage, setServerMessage] = useState('');
  const navigate = useNavigate(); // Add navigation hook

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
    setServerMessage(''); // Clear previous server messages

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      setServerMessage(response.data.message);
      // Optionally navigate to login page after successful registration
      setTimeout(() => navigate('/login'), 2000); // Navigate after 2 seconds
    } catch (error) {
      setServerMessage(error.response?.data.message || 'Error registering');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Register</h2>
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
          <button type="submit" className={`${styles.button} ${styles.registerButton}`}>
            Register
          </button>
          <button
            type="button"
            onClick={handleLoginRedirect}
            className={`${styles.button} ${styles.loginButton}`}
          >
            Login
          </button>
        </div>
        {serverMessage && <p className={styles.serverMessage}>{serverMessage}</p>}
      </form>
    </div>
  );
};

export default Register;