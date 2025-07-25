/**
 * ApplyITR.js - User-facing form to apply for an ITR service.
 * This component provides a form for users to enter their details and upload
 * required documents for an ITR application. It uses React Hook Form for
 * validation and React Query for the API mutation.
 */
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FileText, Upload, Send, AlertCircle } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { successToast, errorToast } from "../../utils/ToastNotfications";

// Form submission function
const applyForITRService = async (formData) => {
  const { data } = await axiosInstance.post("/services/apply/itr", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const ApplyITR = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: applyForITRService,
    onSuccess: () => {
      successToast("ITR application submitted successfully!");
      navigate("/dashboard/services"); // Navigate to my services page on success
    },
    onError: (error) => {
      errorToast(
        error.response?.data?.message || "Submission failed. Please try again."
      );
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    // Append text fields
    formData.append("aadharCardNo", data.aadharCardNo);
    formData.append("panCardNo", data.panCardNo);
    formData.append("accountNo", data.accountNo);
    formData.append("ifscCode", data.ifscCode);

    // Append files
    formData.append("aadharFile", data.aadharFile[0]);
    formData.append("panCardFile", data.panCardFile[0]);
    formData.append("passbookFile", data.passbookFile[0]);

    mutation.mutate(formData);
  };

  // Watch file inputs to display selected file names
  const aadharFile = watch("aadharFile");
  const panCardFile = watch("panCardFile");
  const passbookFile = watch("passbookFile");

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <FileText size={32} />
        <Title>Apply for Income Tax Return (ITR)</Title>
      </Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormSection>
          <SectionTitle>Personal & Bank Details</SectionTitle>
          <InputGroup>
            <Label htmlFor="aadharCardNo">Aadhar Card Number</Label>
            <Input
              id="aadharCardNo"
              type="text"
              {...register("aadharCardNo", {
                required: "Aadhar number is required",
              })}
            />
            {errors.aadharCardNo && (
              <ErrorMessage>{errors.aadharCardNo.message}</ErrorMessage>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="panCardNo">PAN Card Number</Label>
            <Input
              id="panCardNo"
              type="text"
              {...register("panCardNo", { required: "PAN number is required" })}
            />
            {errors.panCardNo && (
              <ErrorMessage>{errors.panCardNo.message}</ErrorMessage>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="accountNo">Bank Account Number</Label>
            <Input
              id="accountNo"
              type="text"
              {...register("accountNo", {
                required: "Account number is required",
              })}
            />
            {errors.accountNo && (
              <ErrorMessage>{errors.accountNo.message}</ErrorMessage>
            )}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              type="text"
              {...register("ifscCode", { required: "IFSC code is required" })}
            />
            {errors.ifscCode && (
              <ErrorMessage>{errors.ifscCode.message}</ErrorMessage>
            )}
          </InputGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>Upload Documents</SectionTitle>
          <FileInputGroup>
            <Label htmlFor="aadharFile">Aadhar Card Upload</Label>
            <FileInputLabel>
              <Upload size={16} />
              <span>
                {aadharFile && aadharFile.length > 0
                  ? aadharFile[0].name
                  : "Choose File"}
              </span>
              <FileInput
                id="aadharFile"
                type="file"
                {...register("aadharFile", {
                  required: "Aadhar file is required",
                })}
              />
            </FileInputLabel>
            {errors.aadharFile && (
              <ErrorMessage>{errors.aadharFile.message}</ErrorMessage>
            )}
          </FileInputGroup>
          <FileInputGroup>
            <Label htmlFor="panCardFile">PAN Card Upload</Label>
            <FileInputLabel>
              <Upload size={16} />
              <span>
                {panCardFile && panCardFile.length > 0
                  ? panCardFile[0].name
                  : "Choose File"}
              </span>
              <FileInput
                id="panCardFile"
                type="file"
                {...register("panCardFile", {
                  required: "PAN card file is required",
                })}
              />
            </FileInputLabel>
            {errors.panCardFile && (
              <ErrorMessage>{errors.panCardFile.message}</ErrorMessage>
            )}
          </FileInputGroup>
          <FileInputGroup>
            <Label htmlFor="passbookFile">Bank Passbook Upload</Label>
            <FileInputLabel>
              <Upload size={16} />
              <span>
                {passbookFile && passbookFile.length > 0
                  ? passbookFile[0].name
                  : "Choose File"}
              </span>
              <FileInput
                id="passbookFile"
                type="file"
                {...register("passbookFile", {
                  required: "Passbook file is required",
                })}
              />
            </FileInputLabel>
            {errors.passbookFile && (
              <ErrorMessage>{errors.passbookFile.message}</ErrorMessage>
            )}
          </FileInputGroup>
        </FormSection>

        <SubmitButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit Application"}
          <Send size={16} />
        </SubmitButton>
      </Form>
    </Container>
  );
};

// Styled Components
const Container = styled(motion.div)`
  padding: 2rem;
  background-color: var(--color-background);
  border-radius: 8px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  color: var(--color-primary);
`;
const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
const FormSection = styled.div`
  background-color: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;
const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  color: var(--color-text-primary);
`;
const InputGroup = styled.div`
  margin-bottom: 1rem;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-secondary);
`;
const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text-primary);
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;
const FileInputGroup = styled(InputGroup)``;
const FileInput = styled.input`
  display: none;
`;
const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px dashed var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text-secondary);
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;
const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;
const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: var(--color-primary);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: var(--color-primary-dark);
  }
  &:disabled {
    background-color: var(--color-text-muted);
    cursor: not-allowed;
  }
`;

export default ApplyITR;
