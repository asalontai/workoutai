"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import LandingPage from "../../../public/Auth Picture.webp";
import Logo from "../../../public/Logo.png"

export default function EmailReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEmailReset = async () => {
    setError("");
    setProcessing(true);

    if (!email) {
      setError("Email is Required.");
      setProcessing(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        setProcessing(false)
        return;
    }

    try {
      const response = await fetch("/api/reset/reset-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setProcessing(false);
        return;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000', 
      }}
    >
      <Image
        src={LandingPage}
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
        bgcolor={"#212122"}
        width={isMobile ? "100vw" : "900px"}
        height={"100vh"}
        gap={2}
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          marginRight: "auto",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: "column",
          color: 'white',
          zIndex: 1,
          opacity: 0.9
        }}
      >
        <Box>
          <Image src={Logo} width={isMobile ? 250 : 300} alt="" />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: "10px" }}>
          Send Reset Email
        </Typography>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            marginTop: "15px",
            marginLeft: isMobile && "16px",
            marginRight: isMobile && "16px",
            width: isMobile ? 'calc(100% - 32px)' : '400px',
            "& .MuiInputLabel-root": {
                color: "white",
            },
            "& .MuiOutlinedInput-root": {
                "& fieldset": {
                    borderColor: "white",
                },
                "&:hover fieldset": {
                    borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                    borderColor: "white",
                },
                "& input": {
                    color: "white",
                },
            },
            "& .MuiInputLabel-outlined": {
                color: "008080",
                "&.Mui-focused": {
                    color: "white",
                },
            },
          }}
        />
        <Box marginTop={"10px"} display={"flex"} textAlign={"center"} justifyContent={"center"} alignItems={"center"} marginLeft={isMobile && "24px"} marginRight={isMobile && "24px"} 
          width={isMobile ? 'calc(100% - 48px)' : '400px'}>
          <Link href={"/auth/sign-in"} className="custom-link">
            Back to Login
          </Link>
        </Box>
        <Button
          sx={{
          bgcolor: "#2D2D2D",
          '&:hover': {
              bgcolor: "#4B4B4B"
          },
          marginLeft: isMobile && "16px",
          marginRight: isMobile && "16px",
          width: isMobile ? 'calc(100% - 32px)' : '400px',
          marginTop: "5px"
        }} 
          variant="contained"
          onClick={handleEmailReset}
        >
          {processing ? "Sending Reset Email..." : "Send Reset Email"}
        </Button>
        <Box marginLeft={isMobile && "16px"} marginRight={isMobile && "16px"} 
          width={isMobile ? 'calc(100% - 32px)' : '400px'} display={"flex"} justifyContent={"center"} alignItems={"center"} height="24px" marginTop={"3px"}>
          {error && (
            <Typography color="error">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
