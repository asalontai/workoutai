"use client"

import { AppBar, Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Image from "next/image";
import Logo from "../../public/Logo.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AccountCircle } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";

const DashbaordLayout = ({ children }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchor, setAnchor] = useState(null);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerOpen(!drawerOpen);
    };

    const handleMenu = (event) => {
        setAnchor(event.currentTarget);
    };

    const handleClosing = () => {
        setAnchor(null);
    };

    return (
        <div>
            <div>
                <AppBar
                    position={"fixed"}
                    sx={{
                    backgroundColor: '#2D2D2D',
                    boxShadow: 'none', 
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1201,
                    opacity: 0.8,
                    }}
                >
                    <Toolbar>
                        <Image 
                            src={Logo}
                            width={200}
                            alt="HeadStarter Logo"
                            className="pointer"
                        />
                        {isMobile ? (
                            <div>
                                <IconButton
                                    color="inherit"
                                    edge="start"
                                    onClick={toggleDrawer(true)}
                                    sx={{ marginLeft: 'auto' }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Drawer
                                    anchor="left"
                                    open={drawerOpen}
                                    onClose={toggleDrawer(false)}
                                    >
                                    <List
                                        sx={{ width: 215, backgroundColor: '#2D2D2D', height: "100vh", paddingTop: 7, textAlign: "center", color: 'white', borderRight: "1px solid white" }} 
                                        onClick={toggleDrawer(false)}
                                        onKeyDown={toggleDrawer(false)}
                                    >
                    
                                        <ListItem sx={{ borderBottom: "1px solid white", borderTop: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
                                            <ListItemText primary="Dashboard" />
                                        </ListItem>
                                        <ListItem sx={{ borderBottom: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => router.push("/dashboard/pricing")}>
                                            <ListItemText primary="Pricing" />
                                        </ListItem>
                                        <ListItem sx={{ borderBottom: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
                                            <ListItemText primary="Sign Out" />
                                        </ListItem>
                                    </List>
                                </Drawer>
                            </div>
                        ) : (
                            <div>
                                <Button color="inherit" onClick={() => router.push("/dashboard")}>
                                    Dashboard
                                </Button>
                                <Button color="inherit" onClick={() => router.push("/dashboard/pricing")}>
                                    Pricing
                                </Button>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={handleMenu}
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchore1={anchor}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchor)}
                                    onClose={handleClosing}
                                    sx={{
                                        "& .MuiPaper-root": {
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "white",
                                            borderRadius: "10px",
                                            mt: 4,
                                            ml: 1,
                                            width: 115,
                                            p: 1,
                                            overflow: "hidden",
                                            color: "black",
                                            textAlign: "center",
                                            boxShadow: "3px 3px 5px 1px rgb(255, 255, 255, 0.4)"
                                        },
                                    }}
                                >
                                    <MenuItem style={{ color: "inherit", opacity: 1, fontWeight: "bold" }} disabled>
                                        Plan: {session?.user.isActive ? "Pro" : "Free"}
                                    </MenuItem>
                                    <MenuItem sx={{ fontWeight: "bold" }} onClick={() => router.push("/dashboard/profile")}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem sx={{ fontWeight: "bold" }}>
                                        Account
                                    </MenuItem>
                                    <MenuItem sx={{ fontWeight: "bold" }} onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
                                        Sign Out
                                    </MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
            {children}
            <Box 
                position="fixed"
                bottom={0}
                left={0}
                width={"100%"}
                bgcolor="#2D2D2D"
                color="white"
                padding={2}
                textAlign="center"
                sx={{ opacity: 0.8, }}
            >
                <Typography variant="body2">
                    &copy; {new Date().getFullYear()} WorkoutAI. All rights reserved. Version 1.0
                </Typography>
            </Box>
        </div>
    )
}

export default DashbaordLayout;