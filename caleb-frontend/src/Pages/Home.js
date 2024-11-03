import React, { useState, useEffect} from 'react';
import { Container, Box, Typography } from '@mui/material';
import './Home.css'; 
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

function Home() {
  const [response, SetResponse] = useState();

  useEffect(() => {

    const fetchData = async() => {
      try {
        const reponse = await axios.get(`${apiUrl}/api/hello`);
        console.log(reponse.data);
        SetResponse(reponse.data);
      }

      catch (error) {
        console.error(error);
      }
    }

    fetchData();
  });

  return (
    <div>
      {/* Image at the top */}
      <Box className="image-box" />

      <Container maxWidth="xl" className="container">
        <Typography variant="header1" className="header1">
          Take the next step.
        </Typography>

        <Typography variant="body1" className="mission">
          Our mission here at TechTask is to empower students in technology and computer science by connecting them with meaningful volunteer opportunities. We aim to bridge the gap between education and real-world experience, offering a platform for students to apply their skills in service to the community. Through volunteerism, networking, and professional development, we strive to foster growth, collaboration, and innovation, helping students build the foundation for successful careers while making a positive impact.
        </Typography>

        <Typography variant="footer" className="footer">
          Copyright 2024 TechTask. All rights reserved | Terms and Conditions
        </Typography>
      </Container>
    </div>
  );
}

export default Home;