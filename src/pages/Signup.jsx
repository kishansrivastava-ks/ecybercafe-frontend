import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, Check } from "lucide-react";
import { successToast } from "../utils/ToastNotfications";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Signup Mutation
  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: (data) => {
      setMessage(data.message);
      successToast("Signup successful. Redirecting to verification page !");
      setTimeout(() => {
        navigate("/verify-email", {
          state: {
            email: formData.email,
            name: formData.name,
            password: formData.password,
          },
        });
      }, 2000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Signup failed");
    },
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    signupMutation.mutate(formData);
  };

  return (
    <Container>
      <ContentWrapper
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <FormSection>
          <HeaderContainer>
            <Title>Create Your Account</Title>
            <Subtitle>Join our platform and start your journey</Subtitle>
          </HeaderContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {message && <SuccessMessage>{message}</SuccessMessage>}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <UserPlus size={20} />
                </InputIcon>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <Mail size={20} />
                </InputIcon>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  required
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputWrapper>
                <InputIcon>
                  <Check size={20} />
                </InputIcon>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  onChange={handleChange}
                />
              </InputWrapper>
            </InputGroup>

            <SubmitButton
              type="submit"
              disabled={signupMutation.isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {signupMutation.isLoading ? "Creating Account..." : "Sign Up"}
            </SubmitButton>

            <LoginPrompt>
              Already have an account?
              <LoginLink href="/login">Log In</LoginLink>
            </LoginPrompt>
          </Form>
        </FormSection>

        {/* <IllustrationSection>
          <Illustration>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 600 600"
              className="w-full h-full"
            >
              <defs>
                <linearGradient
                  id="signupGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path
                fill="url(#signupGradient)"
                d="M300,50 Q500,150 450,300 Q400,450 300,550 Q200,450 150,300 Q100,150 300,50Z"
              />
              <text
                x="300"
                y="300"
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize="48"
                fontWeight="bold"
              >
                Welcome
              </text>
            </svg>
          </Illustration>
        </IllustrationSection> */}
      </ContentWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  width: 100%;
  padding: 1rem;

  @media (min-width: 768px) {
    height: 90vh;
    width: 100vw;
    padding: 0;
  }
`;
const ContentWrapper = styled(motion.div)`
  display: flex;
  width: 100%;
  max-width: 500px;
  overflow: hidden;

  @media (min-width: 768px) {
    width: 50%;
    max-width: 1200px;
  }
`;

const FormSection = styled.div`
  flex: 1;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    padding: 4rem 3rem;
  }
`;

const HeaderContainer = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #2563eb;
  margin-bottom: 0.5rem;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;
const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    gap: 1.25rem;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;

  @media (min-width: 768px) {
    left: 12px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 14px 14px 14px 44px;
    font-size: 1rem;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 1rem;
  }

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  background-color: #fee2e2;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    padding: 10px;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
`;

const SuccessMessage = styled.p`
  color: #10b981;
  background-color: #d1fae5;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    padding: 10px;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
`;

const LoginPrompt = styled.p`
  text-align: center;
  color: #6b7280;
  margin-top: 0.75rem;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    margin-top: 1rem;
    font-size: 1rem;
  }
`;

const LoginLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  margin-left: 0.5rem;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const IllustrationSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Illustration = styled.div`
  width: 80%;
  height: 80%;
`;

export default Signup;
