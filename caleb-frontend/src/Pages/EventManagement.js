import './EventManagement.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextareaAutosize,
  IconButton
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const skillsList = ['Python', 'C++', 'C#', 'C', 'JavaScript', 'HTML', 'IT', 'Computer Repair'];
const urgencies = ['Low', 'Medium', 'High'];


function EventManagement() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: null,
  });

  const [events, setEvents] = useState([]);
  // const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [matchedEvent, setMatchedEvent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  //const [errorMessage, setErrorMessage] = useState('');

  //const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/api/eventmanagement`)
      .then(response => {
        console.log('Fetched events:', response.data);
        setEvents(response.data);
        setErrorMessage('');
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setErrorMessage('Error fetching events.');
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, eventDate: date });
  };

  const handleSkillsChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, requiredSkills: typeof value === 'string' ? value.split(',') : value });
  };

  const removeDatePicker = (index) => {
    const newDate = formData.eventDate.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, eventDate: newDate }));
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.eventName = formData.eventName ? '' : 'Event Name is required';
    tempErrors.eventDescription = formData.eventDescription ? '' : 'Event Description is required';
    tempErrors.location = formData.location ? '' : 'Location is required';
    tempErrors.requiredSkills = formData.requiredSkills.length ? '' : 'Please select at least one skill';
    tempErrors.urgency = formData.urgency ? '' : 'Urgency level is required';
    tempErrors.eventDate = formData.eventDate ? '' : 'Event date is required';
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      //console.log('Submitting form data:', formData);
      try {
        // Make API call to register
        //const response = axios.post('http://localhost:4000/api/eventmanagement', { formData });


        const response = fetch(`${apiUrl}/api/eventmanagement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(formData)
        })


        setSuccessMessage(response.data.message);
        setErrorMessage('');

      } catch (error) {
        if (error.response) {
          if (error.response.data.errors) {
            // Display all errors as a joined string
            setErrorMessage(error.response.data.errors.join('\n'));
          }

          else if (error.response.data.error) {
            setErrorMessage(error.response.data.error);
          }

          else {
            setErrorMessage('Something went wrong. Please try again.');
          }
        }

        else {
          setErrorMessage('Network error. Please check your connection.');
        }

        setSuccessMessage('');
      }
    }
  };

  return (
    <Container maxWidth="sm" className="register-container">
      <Paper elevation={3} className="register-paper">
        <Typography variant="h4" className="register-title">
          Event Management
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              required
              label="Event Name:"
              name="eventName"
              value={formData.eventTitle}
              onChange={handleInputChange}
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              fullWidth
              required
              label="Event Description:"
              name="eventDescription"
              multiline
              rows={4}
              value={formData.eventDescription}
              onChange={handleInputChange}
            />

            <FormControl fullWidth>
            <InputLabel id="skills-label">Required Skills</InputLabel>
            <Select
              labelId="skills-label"
              id="skills"
              multiple
              required
              value={formData.requiredSkills}
              onChange={handleSkillsChange}
              input={<OutlinedInput label="Required Skills" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((skill) => (
                    <Chip key={skill} label={skill} />
                  ))}
                </Box>
              )}
            >
              {skillsList.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  <Checkbox checked={formData.requiredSkills.indexOf(skill) > -1} />
                  <ListItemText primary={skill} />
                </MenuItem>
              ))}
            </Select>

          </FormControl>
            <TextField
              fullWidth
              required
              label="Location:"
              name="location"
              multiline
              rows={2}
              value={formData.location}
              onChange={handleInputChange}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                required
                label="Event Date"
                value={formData.eventDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
            />
            </LocalizationProvider>

            <FormControl fullWidth>
            <InputLabel id="urgency-label">Urgency</InputLabel>
            <Select
              fullWidth
              required
              labelId="urgency-label"
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
            >
              {urgencies.map((urgency) => (
                <MenuItem key={urgency} value={urgency}>
                  {urgency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

            <Button className="submit-button" type="submit" fullWidth>
              SUBMIT
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default EventManagement;