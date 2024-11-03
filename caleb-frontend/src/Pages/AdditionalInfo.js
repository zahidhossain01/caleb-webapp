import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Box, Typography, Paper, MenuItem, Select, InputLabel, FormControl, Chip,
  Checkbox, ListItemText, OutlinedInput, TextareaAutosize, IconButton
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { Cancel as CancelIcon } from '@mui/icons-material';
import './AdditionalInfo.css'; 

const skillsList = [
  "Python",
  "JavaScript",
  "Java",
  "C++",
  "SQL",
  "C",
  "HTML",
  "CSS",
  "React",
  "Angular",
  "Excel",
  "Tableau",
  "R Studio",
  "Programming",
  "Web development",
  "Data analysis",
  "Cybersecurity",
  "Networking and IT",
  "Machine Learning",
  "MySQL",
  "MongoDB",
  "Database management",
  "Figma",
  "Adobe XD",
  "UI/UX",
  "Project management",
  "Event coordination",
  "Software testing",
  "Cloud computing",
  "AWS",
  "Azure",
  "Google Cloud",
  "Mobile app development",
  "iOS",
  "Android",
  "Flutter",
  "Technical support"
];
const statesList = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];



const AdditionalInfo = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    skills: [],
    preferences: '',
    availability: [null] // start with one date picker
  });

  const [successMessage, setSuccessMessage] = useState(''); // Message for profile save status
  const [errorMessage, setErrorMessage] = useState('');     // Message for any error during save
  // const [confirmation, setConfirmation] = useState(false);
  const id = localStorage.getItem('userId');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setFormData((prevData) => ({ ...prevData, skills: e.target.value }));
  };

  const handleDateChange = (index, date) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = date;
    setFormData((prevData) => ({ ...prevData, availability: newAvailability }));
  };

  const addDatePicker = () => {
    setFormData((prevData) => ({
      ...prevData,
      availability: [...prevData.availability, null]
    }));
  };

  const removeDatePicker = (index) => {
    const newAvailability = formData.availability.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, availability: newAvailability }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (id) {
        try {
          const profileResponse = await fetch(`http://localhost:4000/profile/${id}`);
          const profileData = await profileResponse.json();

          if (profileResponse.ok) {
            const parsedProfile = {
              ...profileData,
              availability: profileData.availability.map(dateString => new Date(dateString))
            };

            setFormData(parsedProfile);
          }

          else {
            setErrorMessage('Failed to load.');
          }
        }

        catch (error) {
          setErrorMessage('Error fetching.');
        }
      }

      else {
        setErrorMessage('User ID invalid.');
      }
    };

    fetchProfile();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    // if (!userEmail) {
    if (!userId) {
      setErrorMessage('No user logged in. Please log in.');
      return;
    }

    // Validate form fields
    if (!formData.fullName || !formData.address1 || !formData.city || !formData.state || !formData.zip || formData.skills.length === 0) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    // Prepare the payload to send
    const payload = {
      email: userEmail,
      profile: formData
    };

    // Send a POST request to save profile data
    fetch('http://localhost:4000/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setSuccessMessage(data.message);
          setErrorMessage('');
        } else {
          setErrorMessage('An error occurred while saving your profile.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('An error occurred while saving your profile.');
      });
  };

  return (
    <Container maxWidth="sm" className="additional-info-container">
      <Paper elevation={3} className="additional-info-paper">
        <Typography variant="h4" className="additional-info-title">
          PROFILE MANAGEMENT
        </Typography>

        {successMessage && (
          <Typography variant="body1" className="success-message">
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.fullName}
              onChange={handleInputChange}
              inputProps={{ maxLength: 50 }}
              required
              fullWidth
              className="additional-info-input"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.fullName}
              onChange={handleInputChange}
              inputProps={{ maxLength: 50 }}
              required
              fullWidth
              className="additional-info-input"
            />
            <TextField
              label="Address 1"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              inputProps={{ maxLength: 100 }}
              required
              fullWidth
              className="additional-info-input"
            />
            <TextField
              label="Address 2 (Optional)"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              inputProps={{ maxLength: 100 }}
              fullWidth
              className="additional-info-input"
            />
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              inputProps={{ maxLength: 100 }}
              required
              fullWidth
              className="additional-info-input"
            />
            <FormControl fullWidth required>
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                label="State"
                required
              >
                {statesList.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Zip Code"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              inputProps={{ maxLength: 9, minLength: 5 }}
              required
              fullWidth
              className="additional-info-input"
            />
            <FormControl fullWidth required>
              <InputLabel id="skills-label">Skills</InputLabel>
              <Select
                labelId="skills-label"
                multiple
                value={formData.skills}
                onChange={handleSkillsChange}
                input={<OutlinedInput label="Skills" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {skillsList.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    <Checkbox checked={formData.skills.indexOf(skill) > -1} />
                    <ListItemText primary={skill} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextareaAutosize
              aria-label="Preferences"
              minRows={3}
              placeholder="Preferences (Optional)"
              className="additional-info-textarea"
              value={formData.preferences}
              name="preferences"
              onChange={handleInputChange}
            />
            
            <Typography variant="h6" gutterBottom>Availability</Typography>

            {formData.availability.map((date, index) => (
              <Box key={index} className="additional-info-date-picker">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={`Select Date ${index + 1}`}
                    value={date}
                    onChange={(newDate) => handleDateChange(index, newDate)}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </LocalizationProvider>
                <IconButton color="error" onClick={() => removeDatePicker(index)}>
                  <RemoveCircle />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              onClick={addDatePicker}
              startIcon={<AddCircle />}
              className="additional-info-add-button"
            >
              Add Another Date
            </Button>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              className="additional-info-submit-button"
            >
              SAVE
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default AdditionalInfo;
