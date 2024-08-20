import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Logo from "../../public/Logo.png"
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

const Navbar = ({ show, handleFeatures, handlePricing }) => {
  const [user] = useAuthState(auth)

  const router = useRouter();

  const handleSignOut = async () => {
    signOut(auth).then(() => {
      router.push("/");
    });
  };

  return (
    <>
      {user ? (
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
          }}
        >
          <Toolbar>
            <Image 
                src={Logo}
                width={200}
                alt="HeadStarter Logo"
                className="pointer"
            />
            <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
          </Toolbar>
        </AppBar>
      ) : (
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
            <Button color="inherit" href='/'>Home</Button>
            <Button color="inherit">About Us</Button>
            <Button color="inherit" onClick={handleFeatures}>Features</Button>
            <Button color="inherit" onClick={handlePricing}>Pricing</Button>
            <Button color="inherit" href='/sign-in'>Login</Button>
            <Button color="inherit" href='/sign-up'>Sign Up</Button>
          </Toolbar>
        </AppBar>
      )
    
    
    }
    
    </>
  );
};

export default Navbar;
