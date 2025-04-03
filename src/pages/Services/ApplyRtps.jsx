import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FileText, Building, FileCode, FileSpreadsheet } from "lucide-react";

import axiosInstance from "../../api/axiosInstance";
import { Button, Input, Spinner, Toast } from "../../ui/UIComponents";

const ApplyRtps = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    block: "",
    registrationType: "",
    registrationNumber: "",
  });

  const [toast, setToast] = useState(null);

  const blockOptions = ["GOH", "KONCH"];
  const registrationTypeOptions = ["BRCCO", "BICCO", "BCCCO", "NCLCO", "BOBCO"];

  const mutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/services/apply/rtps", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      setToast({
        type: "success",
        message: "RTPS application submitted successfully!",
      });
      setTimeout(() => navigate("/dashboard/services"), 2000);
    },
    onError: (error) => {
      setToast({
        type: "error",
        message:
          error.response?.data?.message || "Application submission failed",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Destructure form data
    const { block, registrationType, registrationNumber } = formData;

    // Comprehensive validation
    const validations = [
      { field: block, message: "Block is required" },
      { field: registrationType, message: "Registration Type is required" },
      { field: registrationNumber, message: "Registration Number is required" },
    ];

    const failedValidation = validations.find(
      (v) => !v.field || (typeof v.field === "string" && v.field.trim() === "")
    );

    if (failedValidation) {
      setToast({
        type: "error",
        message: failedValidation.message,
      });
      return;
    }

    // Registration number validation
    const regNumberRegex = /^BR-\d{9}$/;
    if (!regNumberRegex.test(registrationNumber)) {
      setToast({
        type: "error",
        message:
          "Invalid Registration Number format. It should be like BR-123456789",
      });
      return;
    }

    // Submit the form
    mutation.mutate(formData);
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormWrapper>
        <FormHeader>
          <FileText size={48} color="var(--color-primary)" />
          <Title>RTPS Application</Title>
          <Subtitle>Complete your application with accurate details</Subtitle>
        </FormHeader>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Building size={20} color="var(--color-text-muted)" />
            <SelectInput
              name="block"
              value={formData.block}
              onChange={handleChange}
              required
              $hasIcon
            >
              <option value="">Select Block</option>
              {blockOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectInput>
          </InputGroup>

          <InputGroup>
            <FileCode size={20} color="var(--color-text-muted)" />
            <SelectInput
              name="registrationType"
              value={formData.registrationType}
              onChange={handleChange}
              required
              $hasIcon
            >
              <option value="">Select Registration Type</option>
              {registrationTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectInput>
          </InputGroup>

          <InputGroup>
            <FileSpreadsheet size={20} color="var(--color-text-muted)" />
            <Input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number (e.g. BR-123456789)"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              $hasIcon
            />
          </InputGroup>

          <Button
            type="submit"
            variant="primary"
            disabled={mutation.isLoading}
            $fullWidth
          >
            {mutation.isLoading ? <Spinner size={20} /> : "Submit Application"}
          </Button>
        </Form>
      </FormWrapper>

      {toast && <Toast type={toast.type}>{toast.message}</Toast>}
    </Container>
  );
};

export default ApplyRtps;

// Styled Components
const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background-color: var(--color-bg);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

const FormWrapper = styled.div`
  padding: 2.5rem;
  width: 50vw;
  background-color: var(--color-bg-elevated);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 1024px) {
    width: 70vw;
  }

  @media (max-width: 768px) {
    width: 90vw;
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 1.5rem 1rem;
  }
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--color-text);
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SelectInput = styled.select`
  flex: 1;
  height: 48px;
  padding-left: ${(props) => (props.$hasIcon ? "2.75rem" : "1rem")};
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }

  &::placeholder {
    color: var(--color-text-placeholder);
  }

  @media (max-width: 480px) {
    height: 44px;
    font-size: 0.9rem;
  }

  option {
    color: var(--color-text);
    background-color: var(--color-bg);
  }
`;
