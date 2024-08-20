"use client"

import { useEffect, useState } from "react";
import { auth, googleProvider } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import WorkoutAI from "@/public/WorkoutAI Logo.png"
import GoogleIcon from '@/public/google-icon.svg'
import Image from "next/image";
import LandingPage from "../../public/Auth Picture.webp";
import Logo from "../../public/Logo.png"
import Footer from "../components/Footer";

export default function SignUp() {
    const [user, loading] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
          router.push("/dashboard");
        }
    }, [loading, user, router]);

    const handleSignUp = async () => {
        setError("");
        setProcessing(true);

        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            setProcessing(false);
            return;
          }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setProcessing(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", email)
            router.push('/sign-in');
        } catch (error) {
            setError(error.message);
            console.log("Error signing up:", error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleGoogle = async () => {
        setError("")
        setProcessing(true);

        try {
            await signInWithPopup(auth, googleProvider);
            console.log("User signed in with Google");
            router.push('/dashboard');
        } catch (error) {
            setError(error.message)
            console.log("Error signing in with Google:", error.message);
        } finally {
            setProcessing(false);
        }
    }

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
                width={"900px"}
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
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        marginTop: "15px",
                        width: "400px",
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        marginTop: "10px",
                        width: "400px",
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{
                        marginTop: "10px",
                        width: "400px",
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
                <Box width={"400px"} marginTop={"20px"} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
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
                        width: '400px', 
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
                    width: "400px",
                    marginTop: "5px"
                }} 
                    variant="contained"
                    onClick={handleGoogle}
                >
                    <Box display={"flex"} width={"400px"} justifyContent={"space-between"} alignItems={"center"}>
                        <Image src={GoogleIcon} height={35} width={35} alt="" />
                        <Typography mr={14}>Sign in with Google</Typography>
                    </Box>
                </Button>
                <Box display={"flex"} alignItems={"center"} gap={1} marginTop={"15px"}>
                    <Typography>Have an account?</Typography>
                    <Link href={"/sign-in"} className="custom-link">
                        Login with account
                    </Link>
                </Box>
                <Box width="400px" display={"flex"} justifyContent={"center"} alignItems={"center"} height="24px" marginTop={"10px"}>
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
