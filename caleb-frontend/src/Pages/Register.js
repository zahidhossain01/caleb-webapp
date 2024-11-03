import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
// import axios from 'axios';
import './Register.css';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const Register = ({ handleLoginState }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMessage(''); 

    try {
      // make call to api to register
      const registerResponse = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        console.log('Register successful', registerData);

        const loginResponse = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          console.log('Login successful after registration.', loginData);

          localStorage.setItem('token', loginData.token);
          localStorage.setItem('userName', loginData.userName);
          localStorage.setItem('userId', loginData.userId);

          if (handleLoginState) {
            handleLoginState(loginData.userName);
          }

          navigate('/AdditionalInfo');
        } 
        
        else {
          setErrorMessage('Login failed after registration. Please try the login page.');
        }
      } 
      
      else {
        setErrorMessage(registerData.message || 'Registration failed. Please try again.');
      }
    } 
    
    catch (error) {
      console.error('Error during Register:', error);
      setErrorMessage('An error occurred. Please try again.');
    } 
    
    finally {
      setLoading(false); 
    }
  };
  
  

  return (
    <Container maxWidth="sm" className="register-container">
      <Paper elevation={3} className="register-paper">
        <Typography variant="h4" className="register-title">
          REGISTER
        </Typography>
        {errorMessage && <Alert severity="error" className="register-error">{errorMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              fullWidth
              className="register-input"
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              fullWidth
              className="register-input"
            />
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              className="register-input"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              className="register-input"
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              className="register-input"
            />
            <Button 
              className="register-button" 
              type="submit" 
              fullWidth
              disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>
          <p>
            Already have an account?
          </p>
          <p>
            Login <Link to="/login">here</Link>!
          </p>
        </form>
      </Paper>
    </Container>
  );
}

export default Register;