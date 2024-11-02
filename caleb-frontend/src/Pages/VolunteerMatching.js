import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, Paper, Alert, MenuItem } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import './VolunteerMatching.css'; 

function VolunteerMatching() {
  const [volunteers, setVolunteers] = useState([]);
  // const [events, setEvents] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [matchedEvent, setMatchedEvent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [matchedEventName, setMatchedEventName] = useState('');
  const [selectedVolunteerName, setSelectedVolunteerName] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/volunteer-matching/volunteers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Fetched volunteers:', res.data);
        setVolunteers(res.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching volunteers:', error);
        setErrorMessage('Failed to load volunteers. Must be logged in.');
      }
    };
  
    fetchVolunteers();
  }, []);

  const handleVolunteerSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedVolunteer(selectedId);
  
    const selectedVolunteerObj = volunteers.find(v => v.id === parseInt(selectedId));
    setSelectedVolunteerName(selectedVolunteerObj?.name || '');
  
    // Fetch the best-matched event for the selected volunteer
    axios.get(`http://localhost:4000/api/volunteer-matching/match`, {
      params: { volunteerId: selectedId }
    })
    .then(response => {
      const matchingEvent = response.data[0];
      if (matchingEvent) {
        setMatchedEvent(matchingEvent.name); // Store the matched event
        setMatchedEventName(matchingEvent.name);
        setErrorMessage('');
      } else {
        setMatchedEvent('');
        setErrorMessage('No matching event found for this volunteer.');
      }
    })
    .catch(error => {
      console.error('Error fetching matched event:', error);
      setErrorMessage('Error fetching matched event.');
    });
  };
  


  return (
    <Container maxWidth="sm" className="volunteer-matching-container">
      <Paper elevation={3} className="volunteer-matching-paper">
        <Typography variant="h4" className="volunteer-matching-title">
          VOLUNTEER MATCHING
        </Typography>

        {errorMessage && <Alert severity="error" className="volunteer-matching-error">{errorMessage}</Alert>}

        <form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Volunteer Name Dropdown */}
            <TextField
              label="Select Volunteer"
              variant="outlined"
              select
              value={selectedVolunteer}
              onChange={handleVolunteerSelect}
              required
              fullWidth
              className="volunteer-matching-input"
            >
              {volunteers.map((volunteer) => (
                <MenuItem key={volunteer.id} value={volunteer.id}>
                  {volunteer.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Matched Event */}
            <TextField
              label="Matched Event"
              variant="outlined"
              value={matchedEvent}
              readOnly
              fullWidth
              className="volunteer-matching-input"
            />

            <Button
              className="volunteer-matching-button"
              type="button"
              fullWidth
              onClick={() => {
                if (selectedVolunteer && matchedEvent) {
                  setOpen(true); // Only open the dialog when the button is clicked and conditions are met
                } else {
                  setErrorMessage('Please select a volunteer and ensure an event is matched.');
                }
              }}
              disabled={!selectedVolunteer || !matchedEvent}
            >
              Match Volunteer
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Match Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedVolunteerName} matched to {matchedEventName}!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default VolunteerMatching;
