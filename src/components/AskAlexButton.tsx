import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { AutoAwesome as SparkleIcon } from '@mui/icons-material';
import { useAlex } from '../contexts/AlexContext';

interface AskAlexButtonProps {
  variant?: 'button' | 'icon';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'inherit';
  sx?: any;
  children?: React.ReactNode;
}

const AskAlexButton: React.FC<AskAlexButtonProps> = ({
  variant = 'button',
  size = 'medium',
  color = 'primary',
  sx = {},
  children,
}) => {
  const { openAlex } = useAlex();

  if (variant === 'icon') {
    return (
      <Tooltip title="Ask Alex">
        <IconButton
          onClick={openAlex}
          size={size}
          color={color}
          sx={sx}
        >
          <SparkleIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      onClick={openAlex}
      size={size}
      color={color}
      startIcon={<SparkleIcon />}
      sx={sx}
    >
      {children || 'Ask Alex'}
    </Button>
  );
};

export default AskAlexButton;
