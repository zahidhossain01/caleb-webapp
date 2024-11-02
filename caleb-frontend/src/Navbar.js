import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Container, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar>
        <Container className="navbar-container" sx={{ paddingRight: '1rem' }}>
          <Button className="navbar-button" component={Link} to="/">Home</Button>
          <Button className="navbar-button" component={Link} to="/login">Login</Button>
          <Button className="navbar-button" component={Link} to="/Register">Register Here</Button>
          
          {/* Drop-down Menu */}
          <Button className="navbar-button" onClick={handleMenuClick}>
            More
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/AdditionalInfo" className = "menu-item">PROFILE MANAGEMENT</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/VolunteerMatching" className = "menu-item">VOLUNTEER MATCHING</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/Notifications" className = "menu-item">NOTIFICATIONS</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/VolunteerHistory" className = "menu-item">VOLUNTEER HISTORY</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/EventManagement" className = "menu-item">EVENT MANAGEMENT</MenuItem>
          </Menu>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
