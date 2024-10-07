"use client"

import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Logo from "../../public/Logo.png"
import defaultProfile from "../../public/DefaultProfile.jpg"
import InputIcon from '@mui/icons-material/Input';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Profile() {
    const { data: session, update } = useSession();

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(session?.user?.name);
    const [newUsername, setNewUsername] = useState(session?.user?.username);
    const [newImage, setNewImage] = useState(session?.user?.image || defaultProfile);

    const handleImage = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return
        }

        const reader = new FileReader();

        reader.onload = () => {
            setNewImage(reader.result)
        };
      
        reader.readAsDataURL(file);
    }

    const handleSave = async () => {
        const response = await fetch("/api/profile/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newName,
                username: newUsername,
                image: newImage,
            }),
        });

        if (response.ok) {
            setIsEditing(!isEditing)
            update();
        } else {
            console.error("Failed to update profile");
        }
    };

    return (
        <Box 
            display="flex"
            flexDirection="column"
            height="100vh"
            color={"black"}
            width={"100vw"}
        >
            <Navbar show={true} transparent={false} />
            <Box
                width={"550px"}
                height={"500px"}
                bgcolor={"white"}
                textAlign={"center"}
                mt={22}
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
                        ml={"auto"}
                        mr={2}
                        mt={2}
                    >
                        {isEditing ? (
                            <IconButton onClick={handleSave}>
                                <SaveAltIcon />
                            </IconButton>
                        ) : (

                            <IconButton onClick={() => setIsEditing(!isEditing)}>
                                <InputIcon />
                            </IconButton>
                        )}
                    </Box>  
                    <Typography variant="h4" mt={1} >
                        Your Profile
                    </Typography>
                    
                    {isEditing ? (
                        <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            mt={4}
                            gap={1}
                        >
                            <Typography variant="h6">
                                Name:
                            </Typography>                        
                            <TextField
                                defaultValue={session?.user?.name}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                label="Name"
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: 145,
                                    height: 40
                                }}
                            />
                        </Box>
                    ) : (
                        <Typography variant="h6" mt={5}>
                            Name: {session?.user?.name ? session?.user?.name : "N/A"}
                        </Typography>
                    )}

                    {isEditing ? (
                        <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            mt={2}
                            gap={1}
                        >
                            <Typography variant="h6">
                                Username:
                            </Typography>  
                            <TextField
                                defaultValue={session?.user?.username}
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                label="Username"
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: 145,
                                    height: 40
                                }}
                            />
                        </Box>
                    ) : (
                        <Typography variant="h6" mt={3}>
                            Username: {session?.user?.username ? session?.user?.username : "N/A"}
                        </Typography>
                    )}

                    <Box
                        display={"flex"}
                        gap={1}
                        alignItems={"center"}
                        justifyContent={"center"}
                        mt={3}
                    >
                        <Typography variant="h6">
                            Email: {session?.user?.email}
                        </Typography>
                    </Box>

                    {isEditing ? (
                        <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            mt={2}
                            gap={1}
                        >
                            <Typography variant="h6">
                                Image:
                            </Typography>
                            <Image src={newImage} height={40} width={40} style={{ borderRadius: '100%', border: "2px solid black"}} alt="" />
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImage} 
                                style={{ display: 'none' }} 
                                id="image-upload"
                            />
                            <label htmlFor="image-upload">
                                <IconButton component="span">
                                    <AddBoxIcon sx={{ width: 40, height: 40, color: "black", ml: -1 }} />
                                </IconButton>
                            </label>
                        </Box>  
                    ) : (
                        <Box
                            display={"flex"}
                            gap={1}
                            alignItems={"center"}
                            justifyContent={"center"}
                            mt={3}
                        >
                            <Typography variant="h6">
                                Image:
                            </Typography>
                            <Image src={session?.user?.image ? session?.user?.image : defaultProfile} height={40} width={40} style={{ borderRadius: '100%', border: "2px solid black"}} alt="" />
                        </Box>
                    )}
                </Box>
            </Box>
            <Footer />
        </Box>
    )
}