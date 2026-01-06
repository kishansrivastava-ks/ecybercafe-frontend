import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/forgot-password", data);
      return res.data;
    },
    onSuccess: () => {
      setStatus("success");
    },
    onError: (err) => {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/login" style={{ textDecoration: "none" }}>
          <BackButton>
            <ArrowLeft size={16} /> Back to Login
          </BackButton>
        </Link>

        {status === "success" ? (
          <SuccessState>
            <IconWrapper color="var(--color-success)">
              <CheckCircle size={48} />
            </IconWrapper>
            <Title>Check your email</Title>
            <Description>
              We have sent a password reset link to <strong>{email}</strong>.
              <br />
              Please check your inbox (and spam folder) and click the link to
              reset your password.
            </Description>
            <SecondaryButton onClick={() => setStatus("idle")}>
              Try another email
            </SecondaryButton>
          </SuccessState>
        ) : (
          <FormSection>
            <Header>
              <Title>Forgot Password?</Title>
              <Description>
                Enter your email address and we'll send you a link to reset your
                password.
              </Description>
            </Header>

            {status === "error" && (
              <ErrorBox>
                <AlertCircle size={18} />
                {errorMessage}
              </ErrorBox>
            )}

            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>Email Address</Label>
                <InputWrapper>
                  <InputIcon>
                    <Mail size={18} />
                  </InputIcon>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <SubmitButton
                type="submit"
                disabled={forgotPasswordMutation.isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {forgotPasswordMutation.isLoading
                  ? "Sending Link..."
                  : "Send Reset Link"}
              </SubmitButton>
            </Form>
          </FormSection>
        )}
      </Card>
    </Container>
  );
};

export default ForgotPassword;

// --- Styled Components ---

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(
    --color-bg
  ); // Ensure your theme handles this or use #f5f7fa
  padding: 1rem;
`;

const Card = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const BackButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
`;

const FormSection = styled.div``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SuccessState = styled.div`
  text-align: center;
  padding: 1rem 0;
`;

const IconWrapper = styled.div`
  color: ${(props) => props.color};
  margin-bottom: 1.5rem;
`;

const SecondaryButton = styled.button`
  margin-top: 1.5rem;
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
`;

const ErrorBox = styled.div`
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;
