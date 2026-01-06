import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const resetPasswordMutation = useMutation({
    mutationFn: async (data) => {
      // Backend expects: token, password, confirmPassword
      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      setStatus("success");
    },
    onError: (err) => {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.message ||
          "Password reset failed. The link may have expired."
      );
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setStatus("error");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      setStatus("error");
      return;
    }
    setErrorMessage("");
    resetPasswordMutation.mutate(formData);
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {status === "success" ? (
          <SuccessState>
            <IconWrapper color="var(--color-success)">
              <CheckCircle size={56} />
            </IconWrapper>
            <Title>Password Reset Successful!</Title>
            <Description>
              Your password has been updated. You can now log in with your new
              credentials.
            </Description>
            <Link to="/login" style={{ textDecoration: "none", width: "100%" }}>
              <PrimaryLinkButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Login <ArrowRight size={18} />
              </PrimaryLinkButton>
            </Link>
          </SuccessState>
        ) : (
          <FormSection>
            <Header>
              <Title>Reset Password</Title>
              <Description>
                Create a new, strong password for your account.
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
                <Label>New Password</Label>
                <InputWrapper>
                  {/* <InputIcon>
                    <Lock size={18} />
                  </InputIcon> */}
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="New password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </TogglePasswordButton>
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <Label>Confirm New Password</Label>
                <InputWrapper>
                  {/* <InputIcon>
                    <Lock size={18} />
                  </InputIcon> */}
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <SubmitButton
                type="submit"
                disabled={resetPasswordMutation.isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {resetPasswordMutation.isLoading
                  ? "Resetting Password..."
                  : "Reset Password"}
              </SubmitButton>
            </Form>
          </FormSection>
        )}
      </Card>
    </Container>
  );
};

export default ResetPassword;

// --- Styled Components (Reused patterns for consistency) ---

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  padding: 1rem;
`;

const Card = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
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

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  display: flex;

  &:hover {
    color: var(--color-primary);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem; /* Padding for left icon and right toggle */
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
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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

/* Success State Styles */
const SuccessState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
`;

const IconWrapper = styled.div`
  color: ${(props) => props.color};
  margin-bottom: 1.5rem;
`;

const PrimaryLinkButton = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 2rem;
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;
