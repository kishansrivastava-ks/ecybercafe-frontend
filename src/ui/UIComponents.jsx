/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Loader2,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

// Base Theme Configuration
const theme = {
  colors: {
    primary: "#0077FF",
    primaryLight: "#3399FF",
    primaryDark: "#005FCC",

    secondary: "#00C896",
    secondaryLight: "#34E0B9",

    accent: "#FFB400",
    accentLight: "#FFD166",

    success: "#22C55E",
    warning: "#FACC15",
    error: "#DC2626",
    info: "#2563EB",

    background: "#F4F7FA",
    surface: "#FFFFFF",
    text: "#1E293B",
    textSecondary: "#4B5563",
    border: "#D1D5DB",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: {
      small: "0.875rem",
      medium: "1rem",
      large: "1.25rem",
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
  },
};

// Animations
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.medium};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: ${theme.spacing.xs};

  background-color: ${({ variant }) => {
    switch (variant) {
      case "primary":
        return theme.colors.primary;
      case "secondary":
        return theme.colors.secondary;
      case "outline":
        return "transparent";
      default:
        return theme.colors.surface;
    }
  }};

  color: ${({ variant }) => {
    switch (variant) {
      case "primary":
      case "secondary":
        return theme.colors.surface;
      case "outline":
        return theme.colors.primary;
      default:
        return theme.colors.text;
    }
  }};

  border: 2px solid
    ${({ variant }) => {
      switch (variant) {
        case "primary":
          return theme.colors.primary;
        case "secondary":
          return theme.colors.secondary;
        case "outline":
          return theme.colors.primary;
        default:
          return theme.colors.border;
      }
    }};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: ${({ size }) => size || "24"}px;
  height: ${({ size }) => size || "24"}px;
  border: 3px solid ${theme.colors.primary};
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Toast = styled.div`
  position: fixed;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.surface};
  animation: ${fadeInAnimation} 0.3s ease-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  background-color: ${({ type }) => {
    switch (type) {
      case "success":
        return theme.colors.success;
      case "error":
        return theme.colors.error;
      case "warning":
        return theme.colors.warning;
      case "info":
        return theme.colors.info;
      default:
        return theme.colors.text;
    }
  }};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.medium};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.2);
  }

  &:disabled {
    background-color: ${theme.colors.surface};
    opacity: 0.6;
  }
`;

// Example Component with Toast and Loading State
const CyberCafeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Simulated async operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setToast({
        type: "success",
        message: "Operation completed successfully!",
      });
    } catch (error) {
      setToast({ type: "error", message: "Something went wrong!" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleClick} disabled={isLoading}>
        {isLoading ? <Spinner size={20} /> : "Perform Action"}
      </Button>

      {toast && (
        <Toast type={toast.type}>
          {toast.type === "success" && <CheckCircle2 />}
          {toast.type === "error" && <X />}
          {toast.message}
        </Toast>
      )}
    </>
  );
};

export { Button, Spinner, Toast, Input, CyberCafeButton, theme };
