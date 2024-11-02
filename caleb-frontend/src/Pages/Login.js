import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';  

const Login = ({ handleLogin }) => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const userResponse = await fetch('http://localhost:4000/login', { 
        method: 'POST', 
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const userData = await userResponse.json();

      if (userResponse.ok) {
        console.log('Login successful!', userData);

        localStorage.setItem('token', userData.token);
        localStorage.setItem('userName', userData.userName);
        localStorage.setItem('userId', userData.userId);
      
        if (handleLogin) {
          handleLogin(userData.userName, userData.userId);
        }
      // localStorage.setItem("token", response.data.token);
      // console.log('User logged in:', response.data.user); 
      // localStorage.setItem('userEmail', email); // store user email in local storage if login successful

      // redirect after login
        navigate('/AdditionalInfo');
      } 
      
      else {
        setErrorMessage(userData.message || 'Login failed. Please try again.');
      }
    }
    
    catch (error) {
      setErrorMessage('An error occurres. Please try again.');
      console.error('Error:', error);
    }

    finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-container" maxWidth="sm">
      <Paper className="login-paper" elevation={3}>
        <Typography className="login-title" variant="h4">LOGIN</Typography>
        {errorMessage && <Alert className="login-error" severity="error">{errorMessage}</Alert>}
        {/* {successMessage && <Alert className="login-success" severity="success">{successMessage}</Alert>} */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              className="login-input" 
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              className="login-input"  
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button 
              className="login-button"  
              type="submit" 
              fullWidth 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;
