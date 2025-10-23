import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  AutoAwesome as SparkleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAlex } from '../contexts/AlexContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'alex';
  timestamp: Date;
}

const AlexChatbot: React.FC = () => {
  const { isOpen, closeAlex } = useAlex();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Alex, your AI assistant. I can help you with dashboard insights, data analysis, and answer questions about your OCC Cove. What would you like to know?",
      sender: 'alex',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your dashboard data, I can see some interesting trends. Would you like me to dive deeper into any specific metrics?",
        "I've analyzed your recent activity and found some optimization opportunities. Let me show you the key insights.",
        "Great question! Looking at your portfolio performance, here are the key recommendations I'd suggest.",
        "I can help you with that. Let me pull up the relevant data and provide you with actionable insights.",
        "Based on the current market conditions and your portfolio, here's what I'm seeing...",
      ];
      
      const alexResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'alex',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, alexResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Show me portfolio performance",
    "Analyze recent trends",
    "What are the key metrics?",
    "Generate insights report",
  ];

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeAlex}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          maxWidth: '90vw',
          backgroundColor: 'background.paper',
          borderLeft: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 40,
                height: 40,
              }}
            >
              <SparkleIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ask Alex
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                AI Assistant
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={closeAlex} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <List sx={{ p: 0 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                <ListItemAvatar
                  sx={{
                    minWidth: 'auto',
                    mx: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.300',
                    }}
                  >
                    {message.sender === 'user' ? (
                      <PersonIcon />
                    ) : (
                      <SparkleIcon />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    '& .MuiListItemText-primary': {
                      backgroundColor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: '80%',
                      wordWrap: 'break-word',
                    },
                  }}
                  primary={message.text}
                />
              </ListItem>
            ))}
            {isTyping && (
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemAvatar sx={{ minWidth: 'auto', mx: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>
                    <SparkleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    '& .MuiListItemText-primary': {
                      backgroundColor: 'grey.100',
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: '80%',
                    },
                  }}
                  primary={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'grey.400',
                          animation: 'typing 1.4s infinite',
                          '@keyframes typing': {
                            '0%, 60%, 100%': { transform: 'translateY(0)' },
                            '30%': { transform: 'translateY(-10px)' },
                          },
                        }}
                      />
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'grey.400',
                          animation: 'typing 1.4s infinite 0.2s',
                          '@keyframes typing': {
                            '0%, 60%, 100%': { transform: 'translateY(0)' },
                            '30%': { transform: 'translateY(-10px)' },
                          },
                        }}
                      />
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'grey.400',
                          animation: 'typing 1.4s infinite 0.4s',
                          '@keyframes typing': {
                            '0%, 60%, 100%': { transform: 'translateY(0)' },
                            '30%': { transform: 'translateY(-10px)' },
                          },
                        }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            )}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        {/* Quick Actions */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Quick Actions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {quickActions.map((action, index) => (
              <Chip
                key={index}
                label={action}
                size="small"
                variant="outlined"
                clickable
                onClick={() => setInputValue(action)}
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Ask Alex anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              sx={{
                minWidth: 'auto',
                px: 2,
                borderRadius: 2,
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AlexChatbot;
