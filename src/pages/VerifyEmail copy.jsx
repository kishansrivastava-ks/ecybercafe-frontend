import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from state
  const { email, name, password } = location.state || {};
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
    try {
      await verifyMutation.mutateAsync({ email, code: otp, name, password });
      navigate("/login"); // Redirect to login after successful verification
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <FormWrapper onSubmit={handleVerify}>
        <h2>Verify Email</h2>
        <p>Enter the OTP sent to your email: {email}</p>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        {message && <SuccessMsg>{message}</SuccessMsg>}
        <input
          type="text"
          placeholder="Enter OTP"
          required
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit" disabled={verifyMutation.isLoading}>
          {verifyMutation.isLoading ? "Verifying..." : "Verify"}
        </button>
      </FormWrapper>
    </Container>
  );
};

export default VerifyEmail;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 14px;
`;

const SuccessMsg = styled.p`
  color: green;
  font-size: 14px;
`;
