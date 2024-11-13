"use client";

import { Suspense, useState } from "react";
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LandingPage from "../../../public/Auth Picture.webp";
import Logo from "../../../public/Logo.png"
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordChangeContent = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handlePasswordChange = async () => {
    setError("");
    setSuccess("");
    setProcessing(true);
    setDisable(true);

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      setProcessing(false);
      setDisable(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        setProcessing(false);
        setDisable(false);
        return;
    }

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        setProcessing(false);
        setDisable(false);
        return;
    }

    try {
      const response = await fetch("/api/reset/new-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error.message);
        setProcessing(false);
        setDisable(false);
        return;
      }

      setSuccess("Password Reset Successful.")

      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    } catch (err) {
      setError(err.message);
      setDisable(false);
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
          Reset Password
        </Typography>
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
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
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  sx={{ color: 'white' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          '&.Mui-disabled': {
            bgcolor: "#5A5A5A", 
            color: "#A0A0A0",   
            cursor: 'not-allowed'
          },
          marginLeft: isMobile && "16px",
          marginRight: isMobile && "16px",
          width: isMobile ? 'calc(100% - 32px)' : '400px',
          marginTop: "5px"
        }} 
          variant="contained"
          disabled={disable}
          onClick={handlePasswordChange}
        >
          {processing ? "Resetting Password..." : "Reset Password"}
        </Button>
        <Box marginLeft={isMobile && "16px"} marginRight={isMobile && "16px"} 
          width={isMobile ? 'calc(100% - 32px)' : '400px'} display={"flex"} justifyContent={"center"} alignItems={"center"} height="24px" marginTop={"10px"} textAlign={"center"}>
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

export default function PasswordChangePage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <PasswordChangeContent />
    </Suspense>

  )
}
