"use client";

import { useEffect, useState } from "react";
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import { Box, Button, Divider, IconButton, InputAdornment, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WorkoutAI from "@/public/WorkoutAI Logo.png"
import GoogleIcon from "@/public/google-icon.svg";
import Image from "next/image";
import LandingPage from "../../../public/Auth Picture.webp";
import Logo from "../../../public/Logo.png"
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [disable, setDisable] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const router = useRouter();

  const handleSignIn = async () => {
    setError("");
    setProcessing(true);
    setDisable(true);

    if (!email || !password) {
      setError("All fields are required.");
      setProcessing(false);
      setDisable(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        setProcessing(false)
        setDisable(false);
        return;
    }

    const signInData = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false
    })

    console.log(signInData)
    setProcessing(false);

    if (signInData.error) {
      console.log(signInData.error)
      if (signInData.error === "CredentialsSignin") {
        setError("Invalid email or password.");
        setProcessing(false);
        setDisable(false);
      } else {
        setError("An unexpected error occurred. Please try again.");
        setProcessing(false);
        setDisable(false);
      }
    } else {
      setSuccess("Log in Successful!")
      setProcessing(false);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  const handleGoogle = async () => {
    setProcessing(true)
    try {
      await signIn("google")
    } catch (err) {
      setProcessing(false)
      setError(err)
    } finally {
      setProcessing(false)
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
          Login
        </Typography>
        <TextField
          label="Email"
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
        <TextField
          label="Password"
          type= {showPassword ? "text" : "password"}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: 'white' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            marginTop: "10px",
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
                color: "white",
                "&.Mui-focused": {
                    color: "white",
                },
            },
          }}
        />
        <Box marginTop={"20px"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} marginLeft={isMobile && "24px"} marginRight={isMobile && "24px"} 
          width={isMobile ? 'calc(100% - 48px)' : '400px'}>
          <Link href={"/auth/reset-email"} className="custom-link">
            Forget Password?
          </Link>
          <Button
            variant="contained"
            onClick={handleSignIn}
            sx={{
              bgcolor: "#2D2D2D",
              '&:hover': {
                  bgcolor: "#4B4B4B"
              },
              '&.Mui-disabled': {
                bgcolor: "#5A5A5A", 
                color: "#A0A0A0",   
                cursor: 'not-allowed'
              },
            }}
            disabled={disable}
          >
            {processing ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
        <Divider 
            sx={{ 
                marginTop: "5px",
                marginBottom: "5px",
                marginLeft: isMobile && "16px",
                marginRight: isMobile && "16px",
                width: isMobile ? 'calc(100% - 32px)' : '400px', 
                color: "white",
                borderColor: "white",
                "&::before, &::after": {
                    borderColor: "white",
                },
                "&.MuiDivider-root": {
                    "&::before, &::after": {
                        borderTop: "thin solid white",
                    },
                },
            }}
        >
            or
        </Divider>
        <Button
          sx={{
          textTransform: "none",
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
          onClick={handleGoogle}
        >
          <Box display={"flex"} width={isMobile ? "100%" : "400px"} justifyContent={"space-between"} alignItems={"center"}>
            <Image src={GoogleIcon} height={35} width={35} alt="" />
            <Typography mr={isMobile ? "auto" : 14} ml={isMobile ? "auto" : 0}>Sign in with Google</Typography>
          </Box>
        </Button>
        <Box marginLeft={isMobile && "auto"} marginRight={isMobile && "auto"} 
          width={isMobile ? '200px' : '400px'} display={"flex"} alignItems={"center"} gap={1} marginTop={"15px"} flexDirection={isMobile && "column"}>
          <Typography ml={"auto"}>Don&apos;t have an account?</Typography>
          <Link href={"/auth/sign-up"} className="custom-link">
            Create an account
          </Link>
        </Box>
        <Box marginLeft={isMobile && "16px"} marginRight={isMobile && "16px"} 
          width={isMobile ? 'calc(100% - 32px)' : '400px'} display={"flex"} justifyContent={"center"} alignItems={"center"} height="24px" marginTop={"10px"}>
          {error && (
            <Typography color="error">
              {error}
            </Typography>
          )}
          {success && (
              <Typography color="success.main">
              {success}
              </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
