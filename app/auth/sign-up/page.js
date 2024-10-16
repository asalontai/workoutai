"use client"

import { useEffect, useState } from "react";
import { Box, Button, Divider, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WorkoutAI from "@/public/WorkoutAI Logo.png"
import GoogleIcon from '@/public/google-icon.svg'
import Image from "next/image";
import LandingPage from "../../../public/Auth Picture.webp";
import Logo from "../../../public/Logo.png"
import { signIn } from "next-auth/react";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const router = useRouter();

    const handleSignUp = async () => {
        setError("");
        setProcessing(true);

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            setProcessing(false);
            return;
        } 

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            setProcessing(false);
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
            setProcessing(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setProcessing(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, password }),
            });

            const data = await response.json();

            if (response.status === 409 || response.status === 500) {
                setError(data.message);
                setProcessing(false);
                return;
            }

            if (response.ok) {
                console.log("User signed up:", data.user);
                router.push('/dashboard/sign-in');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.message);
            console.log("Error signing up:", error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleGoogle = async () => {
        setProcessing(true)
        try {
          await signIn("google")
          setProcessing(false)
        } catch (err) {
          setError(err)
          setProcessing(false)
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
                    <Image src={Logo} width={300} alt="" />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: "10px" }}>
                    Sign Up
                </Typography>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                            color: "008080",
                            "&.Mui-focused": {
                                color: "white",
                            },
                        },
                    }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                            color: "008080",
                            "&.Mui-focused": {
                                color: "white",
                            },
                        },
                    }}
                />
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            color: "008080",
                            "&.Mui-focused": {
                                color: "white",
                            },
                        },
                    }}
                />
                <Box marginTop={"20px"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} marginLeft={isMobile && "24px"} marginRight={isMobile && "24px"} width={isMobile ? 'calc(100% - 48px)' : '400px'}>
                    <Link href={"/sign-in"} className="custom-link">
                        Forget Password?
                    </Link>
                    <Button
                        variant="contained"
                        onClick={handleSignUp}
                        sx={{
                            bgcolor: "#2D2D2D",
                            '&:hover': {
                                bgcolor: "#4B4B4B"
                            },
                        }}
                    >
                        {processing ? "Signing Up..." : "Sign Up"}
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
                <Box marginLeft={isMobile && "auto"} marginRight={isMobile && "auto"} width={isMobile ? '200px' : '400px'} display={"flex"} alignItems={"center"} gap={1} marginTop={"15px"} flexDirection={isMobile && "column"}>
                    <Typography>Have an account?</Typography>
                    <Link href={"/auth/sign-in"} className="custom-link">
                        Login with account
                    </Link>
                </Box>
                <Box marginLeft={isMobile && "16px"} marginRight={isMobile && "16px"} width={isMobile ? 'calc(100% - 32px)' : '400px'} display={"flex"} justifyContent={"center"} alignItems={"center"} height="24px" marginTop={"10px"}>
                    {error && (
                        <Typography color="error">
                            {error}
                        </Typography>
                    )}
                </Box>
            </Box>
      </Box>
    )
}
