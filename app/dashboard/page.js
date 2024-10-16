"use client"

import React, { useState, useEffect, useRef, } from 'react';
import { Box, Button, Stack, TextField, useMediaQuery, useTheme } from "@mui/material";
import { marked } from 'marked';
import Image from 'next/image';
import Icon from "../icon.ico"
import Logo from "../../public/Logo.png"
import defaultProfile from "../../public/DefaultProfile.jpg"
import { BouncingDots } from '../components/bouncingDots';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession();

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([])

  const [message, setMessage] = useState('');

  const [hasInitialMessage, setHasInitialMessage] = useState(false);

  const [name, setName] = useState('');
  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth"})
  }, [messages])

  useEffect(() => {
    let name;
    if (session?.user?.name) {
      name = session.user.name;
      console.log("Session")
    }

    if (!hasInitialMessage && name) {
      setHasInitialMessage(true);
      const initialMessage = `
        <h3>Hello, ${name}!</h3>
        <p>I'm your dedicated fitness coach, here to help you crush your fitness goals.</p>
        <p>Whether you're looking for workout tips, diet advice, or just some motivation, I'm here to guide you.</p>
        <p>How can we kickstart your fitness journey today?</p>
      `;
      typeMessage(initialMessage, 'assistant');
    }
  }, [hasInitialMessage, session]);

  const typeMessage = (messageContent, role) => {
    let index = 0;
    const speed = 0;
    let typedMessage = '';

    function type() {
      if (index < messageContent.length) {
        typedMessage += messageContent.charAt(index);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: typedMessage,
            };
          }
          return newMessages;
        });
        index++;
        typingTimeoutRef.current = setTimeout(type, speed);
      } else {
        setIsTyping(false);
      }
    }
    setMessages([{ role, content: '' }]);
    type();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') {
      return; 
    }

    const newMessage = { role: "user", content: message };

    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ]);

    setMessage("");
    setIsLoading(true)

    const response = await fetch('/api/generate', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, newMessage]),
    });

    setIsLoading(false);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let accumulatedText = '';
    const processText = async ({ done, value }) => {
      if (done) {
        const formattedResponse = marked(accumulatedText); 
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: formattedResponse,
            },
          ];
        });
        return;
      }
      accumulatedText += decoder.decode(value, { stream: true });
      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: marked(accumulatedText),
          },
        ];
      });
      reader.read().then(processText);
    };

    reader.read().then(processText);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      <Box 
        width={"100vw"}
        display="flex"
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        marginTop={"auto"}
        marginBottom={"auto"}
      >
        <Stack
          direction={"column"}
          width={isMobile ? "100vw" : "1000px"}
          height={isMobile ? "630px" : "900px"}
          spacing={3}
          mt={5}
          bgcolor={"white"}
          color={"white"}
          borderRadius={"8px 8px 8px 8px"}
          borderLeft={isMobile && "4px solid #2D2D2D"}
          borderRight={isMobile && "4px solid #2D2D2D"}
          sx={{
            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)"
          }}
        >
          <Box
            height={isMobile ? '45px' : "65px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            borderRadius={"4px 4px 0 0"}
            bgcolor="#2D2D2D"
          >
            {!isMobile && <Image src={Logo} width={300} alt='' />}
          </Box>
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow={"auto"}
            maxHeight={isMobile ? "450px" : "700px"}
            sx={{
              '& .message': {
                marginBottom: '16px',
                borderRadius: '8px',
                wordBreak: 'break-word'
              }
            }}
          >
            {
              messages.map((msg, index) => (
                <Box key={index} display={"flex"} justifyContent={
                  msg.role === 'assistant' ? 'flex-start' : 'flex-end'
                }>
                  <Box
                    display={"flex"}
                    alignItems={"flex-start"}
                    gap={1}
                    mt={1}
                  >
                    {msg.role === 'assistant' && (
                      <Image src={Icon} width={40} height={40} alt='Chatbot Icon' style={{ borderRadius: '100%', marginLeft: isMobile ? 4 : 10, marginRight: "-20px", marginTop: 15, border: "2px solid black" }} />
                    )}
                    <Box
                      bgcolor={
                        msg.role === 'assistant' ? '#2D2D2D' : '#C0C0C0'
                      }
                      color={
                        msg.role === 'assistant' ? "white" : "black"
                      }
                      borderRadius={6}
                      maxWidth={"600px"}
                      p={2}
                      marginRight={"20px"}
                      marginLeft={"20px"}
                      sx={{
                        '& ol': {
                          marginLeft: '5px',
                          marginTop: '10px',
                          marginBottom: '10px'
                        },
                        '& li': {
                          marginBottom: '10px',
                          marginTop: '10px',
                          marginLeft: "28px"
                        },
                        '& p': {
                          marginBottom: '10px',
                          marginTop: '10px',
                          marginLeft: "10px",
                        },
                        '& h3': {
                          marginBottom: '10px',
                          marginTop: '10px',
                          marginLeft: "10px",
                        },
                        '& br': 
                        { 
                          marginTop: "10px", 
                          marginBottom: "10px", 
                        },
                        '& img': {
                          width: "100%",
                          height: "auto",
                          maxWidth: isMobile ? "250px" : "400px",
                          display: 'block',
                          ml: "auto",
                          mr: "auto",
                          mt: 2,
                          mb: 2,
                          bgcolor: "white"
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      {index === messages.length - 1 && isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2}}>
                          <BouncingDots />
                        </Box>
                      ) : (
                        <Box dangerouslySetInnerHTML={{ __html: msg.content }} />
                      )}
                    </Box>
                  </Box>
                  {msg.role === 'user' && (
                      <Image src={ session?.user.image || defaultProfile } width={40} height={40} alt='Chatbot Icon' style={{ borderRadius: '100%', marginLeft: "-14px", marginTop: 15, marginRight: isMobile ? 4 : 10, border: "2px solid black" }} />
                  )}
                </Box>
              ))
            }
            <div ref={messagesEndRef}></div>
          </Stack>
          <Stack 
            direction={"row"} 
            spacing={2}
            padding={2}
            bgcolor={"#2D2D2D"}
          >
            <TextField
              label="Message"
              fullWidth
              sx={{
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
                    color: "white",
                    "&.Mui-focused": {
                        color: "white",
                    },
                },
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button 
              variant="contained" 
              onClick={sendMessage}
              sx={{
                width: "90px",
                bgcolor: "#2D2D2D",
                boxShadow: "0 2px 4px rgba(255, 255, 255, 0.2)",
                border: "1px solid white",
                  '&:hover': {
                    bgcolor: "#4B4B4B",
                } 
                
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
