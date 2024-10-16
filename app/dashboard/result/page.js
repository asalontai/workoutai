"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import Image from 'next/image';
import Logo from "../../../public/Logo.png"
import { useSearchParams } from "next/navigation"
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material"
import { BouncingDots } from "../../components/bouncingDots";
import getStripe from "@/lib/get-stripe";

const ResultPageContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get("session_id")

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    const handleCheckoutSession = async () => {
        const res = await fetch(`/api/stripe/checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error("Server error:", res.status);
            const errorMessage = await res.text();
            console.log(errorMessage);
            return;
        }

        const checkoutSession = await res.json()

        if (res.status == 500) {
            console.log(checkoutSession.error.message);
            return;
        }

        const stripe = await getStripe()

        const { error } = await stripe.redirectToCheckout({
            sessionId: checkoutSession.session.id
        });

        if (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {        
        const fetchCheckoutSession = async () => {

            if (!session_id) {
                return
            }

            try {
                const res = await fetch(`/api/stripe/checkout-session?session_id=${session_id}`)
                const sessionData = await res.json()

                console.log(sessionData)
    
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError("An error occured", err)
            } finally {
                setLoading(false)
            }
        }

        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return (
            <Box 
                display="flex"
                flexDirection="column"
                height="100vh"
                color={"black"}
                width={"100vw"}
            >
                <Box
                    width={"550px"}
                    height={"500px"}
                    bgcolor={"white"}
                    textAlign={"center"}
                    mt={"auto"}
                    mb={"auto"}
                    ml={"auto"}
                    mr={"auto"}
                    borderRadius={"8px 8px 8px 8px"}
                    sx={{
                        boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)"
                    }}
                >
                    <Box
                        bgcolor={"#2D2D2D"}
                        height={"65px"}
                        color={"white"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        borderRadius={"4px 4px 0 0"}
                    >
                        <Image src={Logo} width={300} alt='' />
                    </Box> 
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        height={"435px"}
                    >
                        <Box 
                            height={20}
                            mt={25}
                        >
                            <BouncingDots />
                        </Box>
                    </Box> 
                </Box>
            </Box>
        )
    }

    if (error) {
        <Box 
            display="flex"
            flexDirection="column"
            height="100vh"
            color={"black"}
            width={"100vw"}
        >
            <Box
                width={"550px"}
                height={"500px"}
                bgcolor={"white"}
                textAlign={"center"}
                mt={"auto"}
                mb={"auto"}
                ml={"auto"}
                mr={"auto"}
                borderRadius={"8px 8px 8px 8px"}
                sx={{
                    boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)"
                }}
            >
                <Box
                    bgcolor={"#2D2D2D"}
                    height={"65px"}
                    color={"white"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    borderRadius={"4px 4px 0 0"}
                >
                    <Image src={Logo} width={300} alt='' />
                </Box> 
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    height={"435px"}
                >
                    <Typography variant="h4" mt={8} >
                        You have an Error
                    </Typography>
                    <Typography variant="h5" mt={5}>
                        Error:
                    </Typography>
                    <Typography fontSize={12} mt={5}>
                        { error }
                    </Typography>
                    <Button
                        variant="contained" 
                        sx={{ 
                            mt: 6, 
                            mb: 2, 
                            height: "45px",
                            width: "125px",
                            bgcolor: "#2D2D2D",
                            '&:hover': {
                                bgcolor: "#4B4B4B"
                            } 
                        }}
                        onClick={handleCheckoutSession}
                    >
                        Try Again
                    </Button>
                </Box> 
            </Box>
        </Box>
    }

    return (
        <Box 
            display="flex"
            flexDirection="column"
            height="100vh"
            color={"black"}
            width={"100vw"}
        >
            {
                session.payment_status === "paid" ? (
                    <Box
                        width={"550px"}
                        height={"500px"}
                        bgcolor={"white"}
                        textAlign={"center"}
                        mt={"auto"}
                        mb={"auto"}
                        ml={"auto"}
                        mr={"auto"}
                        borderRadius={"8px 8px 8px 8px"}
                        sx={{
                            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)"
                        }}
                    >
                        <Box
                            bgcolor={"#2D2D2D"}
                            height={"65px"}
                            color={"white"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            borderRadius={"4px 4px 0 0"}
                        >
                            <Image src={Logo} width={300} alt='' />
                        </Box>                
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            height={"435px"}
                        >
                            <Typography variant="h4" mt={5} >
                                Thank you for purchasing
                            </Typography>
                            <Typography variant="h5" mt={5}>
                                Session ID:
                            </Typography>
                            <Typography fontSize={12} mt={1}>
                                { session_id }
                            </Typography>
                            <Typography variant="h6" mt={5} width={"475px"}>
                                We have received your payment. You will recieve an email with the order details shortly.
                            </Typography>
                            <Button
                                variant="contained" 
                                sx={{ 
                                    mt: 6, 
                                    mb: 2, 
                                    height: "45px",
                                    width: "125px",
                                    bgcolor: "#2D2D2D",
                                    '&:hover': {
                                        bgcolor: "#4B4B4B"
                                    } 
                                }}
                                onClick={() => router.push("/dashboard")}
                            >
                                Proceed
                            </Button>
                        </Box>
                    </Box>
               ) : (
                    <Box
                        width={"550px"}
                        height={"500px"}
                        bgcolor={"white"}
                        textAlign={"center"}
                        mt={"auto"}
                        mb={"auto"}
                        ml={"auto"}
                        mr={"auto"}
                        borderRadius={"8px 8px 8px 8px"}
                        sx={{
                            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)"
                        }}
                    >
                        <Box
                            bgcolor={"#2D2D2D"}
                            height={"65px"}
                            color={"white"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            borderRadius={"4px 4px 0 0"}
                        >
                            <Image src={Logo} width={300} alt='' />
                        </Box>                
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            height={"435px"}
                        >
                            <Typography variant="h4" mt={13} >
                                Payment Failed
                            </Typography>
                            <Typography variant="h6" mt={5} width={"475px"}>
                                Your payment was not successful! Please try again!
                            </Typography>
                            <Button
                                variant="contained" 
                                sx={{ 
                                    mt: 6, 
                                    mb: 2, 
                                    height: "45px",
                                    width: "125px",
                                    bgcolor: "#2D2D2D",
                                    '&:hover': {
                                        bgcolor: "#4B4B4B"
                                    } 
                                }}
                                onClick={handleCheckoutSession}
                            >
                                Try Again
                            </Button>
                        </Box>
                    </Box>
                )
            }
        </Box>
    )
}

export default function ResultPage() {
    return (
        <Suspense fallback={<CircularProgress />}>
            <ResultPageContent />
        </Suspense>
    );
}