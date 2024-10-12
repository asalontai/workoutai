import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useMediaQuery, useTheme } from '@mui/material';
import Logo from "../../public/Logo.png";
import { AccountCircle } from '@mui/icons-material';

const Navbar = ({ transparent, show, handleFeatures, handlePricing }) => {
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
    <>
      <AppBar
        position={transparent ? "relative" : "fixed"}
        sx={{
          backgroundColor: '#2D2D2D',
          boxShadow: 'none', 
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1201,
          opacity: 0.8,
          transition: 'transform 0.3s ease', 
          transform: show ? 'translateY(0)' : 'translateY(-100%)',
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
              <>
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
                    {session ? (
                      <>                      
                        <ListItem sx={{ borderBottom: "1px solid white", borderTop: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
                          <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem sx={{ borderBottom: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => router.push("/pricing")}>
                          <ListItemText primary="Pricing" />
                        </ListItem>
                        <ListItem sx={{ borderBottom: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
                          <ListItemText primary="Sign Out" />
                        </ListItem>
                      </>
                    ) : (
                      <>
                        <ListItem sx={{ borderTop: "1px solid white", borderBottom: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => router.push('/')}>
                          <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem sx={{ borderBottom: "1px solid white", textAlign: "center", cursor: "pointer" }}>
                          <ListItemText primary="About Us" />
                        </ListItem>
                        <ListItem sx={{ borderBottom: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={handleFeatures}>
                          <ListItemText primary="Features" />
                        </ListItem>
                        <ListItem sx={{ borderBottom: "1px solid white", textAlign: "center", cursor: "pointer" }} onClick={handlePricing}>
                          <ListItemText primary="Pricing" />
                        </ListItem>
                        <ListItem sx={{ borderBottom: "2px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => router.push('/sign-in')}>
                          <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem sx={{ borderBottom: "2px solid white", textAlign: "center", cursor: "pointer" }} onClick={() => router.push('/sign-up')}>
                          <ListItemText primary="Sign Up" />
                        </ListItem>
                      </>
                    )}
                  </List>
                </Drawer>
              </>
            ) : (
              <>
                {session ? (
                  <>  
                    <Button color="inherit" onClick={() => router.push("/dashboard")}>Dashboard</Button>
                    <Button color="inherit" onClick={() => router.push("/pricing")}>Pricing</Button>
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
                      anchorE1={anchor}
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
                      <MenuItem style={{ color: "inherit", opacity: 1, fontWeight: "bold" }} disabled>Plan: {session.user.isActive ? "Pro" : "Free"}</MenuItem>
                      <MenuItem sx={{ fontWeight: "bold" }} onClick={() => router.push("/profile")}>Profile</MenuItem>
                      <MenuItem sx={{ fontWeight: "bold" }}>Account</MenuItem>
                      <MenuItem sx={{ fontWeight: "bold" }} onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>Sign Out</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button color="inherit" href='/'>Home</Button>
                    <Button color="inherit">About Us</Button>
                    <Button color="inherit" onClick={handleFeatures}>Features</Button>
                    <Button color="inherit" onClick={handlePricing}>Pricing</Button>
                    <Button color="inherit" onClick={() => { router.push("/sign-in") }}>Login</Button>
                    <Button color="inherit" onClick={() => { router.push("/sign-up") }}>Sign Up</Button>
                  </>
                )}
              </>
            )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;