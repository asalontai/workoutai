import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useMediaQuery, useTheme } from '@mui/material';
import Logo from "../../public/Logo.png";

const Navbar = ({ show, handleFeatures, handlePricing }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
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
                    sx={{ width: 215, backgroundColor: '#2D2D2D', height: "100vh", paddingTop: 7, textAlign: "center", color: 'white' }} 
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                  >
                    {session ? (
                      <ListItem sx={{ border: "2px solid white" }} onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
                        <ListItemText primary="Sign Out" />
                      </ListItem>
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
                  <Button color="inherit" onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>Sign Out</Button>
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