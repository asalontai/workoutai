"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Container, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from './components/Footer'; // Import Footer component
import { FitnessCenter, HelpCenter, Restaurant } from '@mui/icons-material';
import Navbar from './components/Navbar';
export default function LandingPage() {
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const featuresSection= useRef(null);
  const pricingSection= useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLearnMoreClick = () => {
    if (featuresSection.current) {
      featuresSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFeaturesClick = () => {
    if (featuresSection.current) {
      featuresSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePricingClick = () => {
    if (pricingSection.current) {
      pricingSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return (
    <div>
      <Navbar show={showNavbar} handleFeatures={handleFeaturesClick} handlePricing={handlePricingClick} />
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#000', 
          textAlign: {
           sm: "center" 
          },
          width: {
            sm: "100%"
          }
        }}
      >
        <Image
          src="/Push Up.jpg"
          alt="Landing Page Background"
          layout="fill"
          objectFit="cover"
          priority
          className='background'
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: isMobile ? 0 : 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: "column",
            color: 'white',
            zIndex: 1,
            textAlign: isMobile ? "center" : 'right',
          }}
        >
          <Typography 
            variant="h1" 
            sx={{ 
              width: isMobile ? "100%" : "650px", 
              mb: 1, 
              fontSize: isMobile && "3.2rem"
            }}
          >
            Empowering Your Fitness Journey, One Step at a Time!
          </Typography>
          <Typography 
            variant='h6' 
            sx={{ 
              width: isMobile ? "100%" : "650px",
              textAlign: "center", 
              ml: isMobile ? 2 : 5,
              pl: isMobile ? 1 : 0, 
              pr: isMobile ? 3 : 0, 
              mt: isMobile ? 2 : 1,
              fontSize: isMobile && "1.0rem" 
            }}
          >
            Meet WorkoutAI, your 24/7 personal fitness and diet assistant! Tailored workouts, dietary advice, and healthy choices are just a chat away. Whether you’re aiming for muscle gain, fat loss, or overall wellness, get the guidance you need to achieve your goals sustainably and enjoyably.
          </Typography>
          <Button
            variant='contained'
            size='large'
            onClick={handleLearnMoreClick}
            sx={{
              bgcolor: "#2D2D2D",
              color: 'white',
              ml: 48,
              mr: "auto",
              mt: 2, 
              '&:hover': {
                bgcolor: "#4B4B4B"
              },
              "@media (max-width: 600px)": {
                ml: "auto",
                mr: "auto",
                mt: 3
              }
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      <Box
        ref={featuresSection}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        sx={{
          backgroundColor: '#1a1a1a',
          padding: '40px 0',
          minHeight: '100vh',
          color: "white"
        }}
      >
        <Typography variant="h3" align="center" fontWeight={"bold"} sx={{ mb: 5, paddingBottom: "3px", borderBottom: "2px solid white" }}>
          Features
        </Typography>

        <Grid container justifyContent={"center"} spacing={isMobile ? 7 : 10} mb={5}>
          <Grid item xs={10} md={3}>
            <Box
              sx={{
                color: "black",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                boxShadow: "",
                height: "220px",
                borderRadius: 3,
                boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)",
                "@media (max-width: 600px)": {
                  textAlign: "center"
                }
              }}
            >
              <Box
                borderRadius={30}
                width={60}
                height={60}
                border={"3px solid black"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={1}
              >
                <FitnessCenter sx={{ width: 45, height: 45}} />
              </Box>
              <Typography variant='h6' mb={1} fontWeight={"bold"}>Personalized Workout Plans</Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Guide to different style of workouts</Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Coach to develop good workout form</Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Catalog of many exercises</Typography>
            </Box>
          </Grid>
          <Grid item xs={10} md={3}>
            <Box
              sx={{
                color: "black",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                boxShadow: "",
                height: "220px",
                borderRadius: 3,
                boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)",
                "@media (max-width: 600px)": {
                  textAlign: "center"
                }
              }}
            >
              <Box
                borderRadius={30}
                width={60}
                height={60}
                border={"3px solid black"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={1}
              >
                <Restaurant sx={{ width: 45, height: 45}} />
              </Box>
              <Typography variant='h6' mb={1} fontWeight={"bold"}>Nutritional Advice based on Needs</Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Customized meal plans for dietary goals</Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Nutrient-dense food recommendations</Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Caloric intake and macronutrient balance</Typography>
            </Box>
          </Grid>
          <Grid item xs={10} md={3}>
            <Box
              sx={{
                color: "black",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                boxShadow: "",
                height: "220px",
                borderRadius: 3,
                boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)",
                "@media (max-width: 600px)": {
                  textAlign: "center"
                }
              }}
            >
              <Box
                borderRadius={30}
                width={60}
                height={60}
                border={"3px solid black"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={1}
              >
                <HelpCenter sx={{ width: 45, height: 45}} />
              </Box>
              <Typography 
                variant='h6' 
                mb={1} 
                fontWeight={"bold"}
              >
                24/7 Chatbot Support
              </Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Instant responses to your queries anytime</Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Personalized guidance for your fitness journey</Typography>
              <Typography variant='p' sx={{ marginTop: "5px" }}>- Comprehensive resources at your fingertips</Typography>
            </Box>
          </Grid>
        </Grid>
        <div ref={pricingSection}></div>
        <Typography variant="h3" align="center" fontWeight={"bold"} sx={{ mb: 5, paddingBottom: "3px", borderBottom: "2px solid white" }}>
          Pricing
        </Typography>
        <Grid container justifyContent={"center"} spacing={isMobile ? 7 : 10}>
          <Grid item xs={10} md={3}>
            <Box
              sx={{
                color: "black",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                boxShadow: "",
                height: "200px",
                borderRadius: 3,
                boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)"
              }}
            >
              <Typography variant='h5' mt={2} fontWeight={"bold"} >Free</Typography>
              <Typography variant='h6'> $0.00 / month</Typography>
              <Typography >Access to 10 free chats per month</Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2, 
                  mb: 2, 
                  bgcolor: "#2D2D2D",
                  '&:hover': {
                    bgcolor: "#4B4B4B"
                  } 
                }}
              >
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={10} md={3}>
            <Box
              sx={{
                color: "black",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                boxShadow: "",
                height: "200px",
                borderRadius: 3,
                boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)"
              }}
            >
              <Typography variant='h5' mt={2} fontWeight={"bold"} >Pro</Typography>
              <Typography variant='h6'> $5.00 / month</Typography>
              <Typography >Access to unlimited chats per month</Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 2, 
                  mb: 2, 
                  bgcolor: "#2D2D2D",
                  '&:hover': {
                    bgcolor: "#4B4B4B"
                  } 
                }}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </div>
  );
}
