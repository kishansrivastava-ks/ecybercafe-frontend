import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from state
  const { email, name, password, jila, prakhand } = location.state || {};

  // OTP Verification Mutation
  const verifyMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/verify-email", data);
      return res.data;
    },
    onSuccess: (data) => {
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Verification failed");
    },
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    verifyMutation.mutate({ email, code: otp, name, password, jila, prakhand });
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FormWrapper onSubmit={handleVerify}>
        <Title>Verify Email</Title>
        <Text>
          Enter the OTP sent to: <strong>{email}</strong>
        </Text>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        {message && <SuccessMsg>{message}</SuccessMsg>}
        <Input
          type="text"
          placeholder="Enter OTP"
          required
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button type="submit" disabled={verifyMutation.isLoading}>
          {verifyMutation.isLoading ? "Verifying..." : "Verify"}
        </Button>
      </FormWrapper>
    </Container>
  );
};

export default VerifyEmail;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.background};
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
  padding: 24px;
  background: ${({ theme }) => theme.cardBackground};
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.primary};
  font-size: 24px;
`;

const Text = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  font-size: 16px;
  background: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 6px;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }

  &:disabled {
    background: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
`;

const SuccessMsg = styled.p`
  color: green;
  font-size: 14px;
  text-align: center;
`;
