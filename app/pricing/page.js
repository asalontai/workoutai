"use client"

import { Box, Button, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../components/Navbar"
import getStripe from '@/lib/get-stripe';
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { getSession, useSession } from "next-auth/react";

export default function Pricing() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: session } = useSession()

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

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            color={"white"}
        >
            <Box marginBottom={3} height={"25px"}>
                <Navbar show={true} transparent={false}/>
            </Box>
            <Box
                mt={"auto"}
                mb={"auto"}
                ml={"auto"} 
                mr={"auto"}
                textAlign={"center"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Typography pb={2} width={200} variant={isMobile ? "h3" : "h2"} align="center" fontWeight={"bold"} mb={isMobile ? 5 : ""} sx={{ paddingBottom: "3px", borderBottom: "2px solid white" }}>
                    Pricing
                </Typography>
                <Grid container justifyContent={"center"} spacing={isMobile ? 7 : 20}>
                <Grid item xs={10} md={4}>
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
                            height: "250px",
                            borderRadius: 3,
                            boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)"
                        }}
                    >
                        <Typography variant='h3' mt={1} fontWeight={"bold"} >Free</Typography>
                        <Typography variant='h5' mt={1}> $0.00 / month</Typography>
                        <Typography variant="h6" mt={1} maxWidth={"250px"}>Access to 10 free chats per month</Typography>
                        <Button 
                                variant="contained" 
                                sx={{ 
                                    mt: 1, 
                                    mb: 2, 
                                    height: "50px",
                                    width: "150px",
                                    color: !session?.user?.isActive ? "black" : "white",
                                    bgcolor: !session?.user?.isActive ? "white" : "#2D2D2D",
                                    '&:hover': {
                                        bgcolor: !session?.user?.isActive ? "white" : "#4B4B4B"
                                    } 

                                }}
                                disabled={!session?.user?.isActive}
                            >
                                {!session?.user?.isActive ? "Current Plan" : "Choose Free"}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={10} md={4}>
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
                            height: isMobile ? "250px" : "300px",
                            borderRadius: 3,
                            boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)"
                        }}
                        >
                            <Typography variant='h3' mt={1} fontWeight={"bold"} >Pro</Typography>
                            <Typography variant='h5' mt={isMobile ? 1 : 2}> $5.00 / month</Typography>
                            <Typography variant="h6" mt={isMobile ? 1 : 2}>Access to unlimited chats per month</Typography>
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    mt: 1, 
                                    mb: 1, 
                                    height: "50px",
                                    width: "150px",
                                    color: session?.user?.isActive ? "black" : "white",
                                    bgcolor: session?.user?.isActive ? "white" : "#2D2D2D",
                                    '&:hover': {
                                        bgcolor: session?.user?.isActive ? "white" : "#4B4B4B"
                                    } 

                                }}
                                onClick={handleCheckoutSession}
                                disabled={session?.user?.isActive}
                            >
                                {session?.user?.isActive ? "Current Plan" : "Choose Pro"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </Box>
    )
}