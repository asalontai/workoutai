"use client"

import { Box, Button, Grid, Typography, useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../components/Navbar"
import getStripe from '@/lib/get-stripe';
import Footer from "../components/Footer";

export default function Pricing() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            alignItems={"center"}
            justifyContent={"center"}
            color={"white"}
        >
            <Navbar show={true} transparent={false} />
            <Typography mt={-6} variant="h2" align="center" fontWeight={"bold"} sx={{ paddingBottom: "3px", borderBottom: "2px solid white" }}>
                Pricing
            </Typography>
            <Grid container mt={1} justifyContent={"center"} spacing={isMobile ? 7 : 10}>
            <Grid item xs={10} md={5}>
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
                        height: "300px",
                        borderRadius: 3,
                        boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)"
                    }}
                >
                    <Typography variant='h3' mt={1} fontWeight={"bold"} >Free</Typography>
                    <Typography variant='h5' mt={2}> $0.00 / month</Typography>
                    <Typography variant="h6" mt={2}>Access to 10 free chats per month</Typography>
                    <Button 
                        variant="contained" 
                        sx={{ 
                        mt: 3, 
                        mb: 2,
                        height: "50px",
                        width: "150px",
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
                <Grid item xs={10} md={5}>
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
                        height: "300px",
                        borderRadius: 3,
                        boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)"
                    }}
                    >
                        <Typography variant='h3' mt={1} fontWeight={"bold"} >Pro</Typography>
                        <Typography variant='h5' mt={2}> $5.00 / month</Typography>
                        <Typography variant="h6" mt={2}>Access to unlimited chats per month</Typography>
                        <Button 
                            variant="contained" 
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                height: "50px",
                                width: "150px",
                                bgcolor: "#2D2D2D",
                                '&:hover': {
                                    bgcolor: "#4B4B4B"
                                } 
                            }}
                            onClick={handleCheckoutSession}
                        >
                            Choose Pro
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Footer />
        </Box>
    )
}