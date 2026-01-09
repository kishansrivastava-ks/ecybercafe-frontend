import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";

// Import Auth Context
import useAuth from "../contexts/useAuth";

// UI Components
import { Spinner, Toast } from "../ui/UIComponents";
import { errorToast, successToast } from "../utils/ToastNotfications";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await login(email, password);

      successToast("Login Successful");

      // Redirect based on user role
      setTimeout(() => {
        navigate(
          data.user.role === "admin"
            ? "/admin-dashboard/services"
            : "/dashboard/services"
        );
      }, 1500);
    } catch (err) {
      // Error handling
      setError(err.message || "Login failed. Please try again.");
      errorToast("Login failed. Please try again !");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <PageContainer>
      {/* Toast Notification */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}

      <LoginWrapper
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 120,
        }}
      >
        <HeaderSection>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to continue to your account</Subtitle>
        </HeaderSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <EmailIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </EmailIcon>
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
          </InputGroup>

          <ForgotPasswordLink href="/forgot-password">
            Forgot Password?
          </ForgotPasswordLink>

          <SubmitButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="small" />
            ) : (
              <>
                <LogIn size={20} />
                Login
              </>
            )}
          </SubmitButton>

          <SignupPrompt>
            Don't have an account?
            <SignupLink href="/signup">Sign Up</SignupLink>
          </SignupPrompt>
        </form>
      </LoginWrapper>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  max-height: 90dvh;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const LoginWrapper = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  border-radius: 1.5rem;
  padding: 1.5rem;

  @media (min-width: 768px) {
    min-width: 450px;
    padding: 2.5rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 1.25rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem;
  padding-right: ${(props) => (props.type === "password" ? "3rem" : "1rem")};
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 0.875rem 1rem;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const EmailIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ForgotPasswordLink = styled.a`
  display: block;
  text-align: right;
  color: #3b82f6;
  font-size: 0.75rem;
  margin-top: 0.375rem;
  text-decoration: none;

  @media (min-width: 768px) {
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  transition: background-color 0.3s ease;

  @media (min-width: 768px) {
    padding: 0.875rem;
    margin-top: 1.5rem;
  }

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 1.25rem;
  color: #6b7280;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    margin-top: 1.5rem;
  }
`;
const SignupLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  margin-left: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default Login;
