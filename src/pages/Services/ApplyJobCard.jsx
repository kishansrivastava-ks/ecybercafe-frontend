import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Briefcase,
  User,
  UserCheck,
  Upload,
  File,
  X,
  FileText,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";
import { Button, Input, Spinner, Toast } from "../../ui/UIComponents";

const ApplyJobCard = () => {
  const navigate = useNavigate();
  const aadharInputRef = useRef(null);
  const passbookInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    fatherHusbandName: "",
    aadharFile: null,
    passbookFile: null,
  });

  const [fileInfo, setFileInfo] = useState({
    aadharFile: null,
    passbookFile: null,
  });

  const [toast, setToast] = useState(null);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("name", data.name);
      formDataToSend.append("fatherHusbandName", data.fatherHusbandName);

      // Append files
      if (data.aadharFile) formDataToSend.append("aadharFile", data.aadharFile);
      if (data.passbookFile)
        formDataToSend.append("passbookFile", data.passbookFile);

      const res = await axiosInstance.post(
        "/services/apply/job-card",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setToast({
        type: "success",
        message: "Job Card application submitted successfully!",
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      // Validate file type and size
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "image/jpg",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(files[0].type)) {
        setToast({
          type: "error",
          message: "Only JPEG, PNG, and PDF files are allowed",
        });
        return;
      }

      if (files[0].size > maxSize) {
        setToast({
          type: "error",
          message: "File size should not exceed 5MB",
        });
        return;
      }

      // Store file info for preview
      setFileInfo((prev) => ({
        ...prev,
        [name]: {
          name: files[0].name,
          size: formatFileSize(files[0].size),
          type: files[0].type,
        },
      }));

      // Store file in state
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const removeFile = (type) => {
    setFileInfo((prev) => ({
      ...prev,
      [type]: null,
    }));
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));

    // Reset file input
    if (type === "aadharFile" && aadharInputRef.current) {
      aadharInputRef.current.value = "";
    }
    if (type === "passbookFile" && passbookInputRef.current) {
      passbookInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Destructure form data
    const { name, fatherHusbandName, aadharFile, passbookFile } = formData;

    // Comprehensive validation
    const validations = [
      { field: name, message: "Name is required" },
      {
        field: fatherHusbandName,
        message: "Father's/Husband's Name is required",
      },
      { field: aadharFile, message: "Aadhar document is required" },
      { field: passbookFile, message: "Passbook document is required" },
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

    // Submit the form
    mutation.mutate(formData);
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <File size={24} />;

    if (fileType.includes("pdf")) {
      return <FileText size={24} color="#E74C3C" />;
    } else if (fileType.includes("image")) {
      return <File size={24} color="#3498DB" />;
    } else {
      return <File size={24} />;
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormWrapper>
        <FormHeader>
          <Briefcase size={48} color="var(--color-primary)" />
          <Title>Job Card Application</Title>
          <Subtitle>Complete your application with accurate details</Subtitle>
        </FormHeader>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <User size={20} color="var(--color-text-muted)" />
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              $hasIcon
            />
          </InputGroup>

          <InputGroup>
            <UserCheck size={20} color="var(--color-text-muted)" />
            <Input
              type="text"
              name="fatherHusbandName"
              placeholder="Father's/Husband's Name"
              value={formData.fatherHusbandName}
              onChange={handleChange}
              required
              $hasIcon
            />
          </InputGroup>

          <FileUploadSection>
            <FileUploadGroup>
              <FileUploadLabel>Upload Aadhar Document</FileUploadLabel>
              <FileUploadWrapper>
                <HiddenFileInput
                  type="file"
                  name="aadharFile"
                  ref={aadharInputRef}
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
                <FileUploadButton
                  type="button"
                  onClick={() => aadharInputRef.current.click()}
                >
                  <Upload size={20} />
                  <span>Upload Aadhar</span>
                </FileUploadButton>
              </FileUploadWrapper>
              {fileInfo.aadharFile && (
                <FilePreviewContainer>
                  <FileIconSection>
                    {getFileIcon(fileInfo.aadharFile.type)}
                  </FileIconSection>
                  <FileInfoSection>
                    <FileName>{fileInfo.aadharFile.name}</FileName>
                    <FileSize>{fileInfo.aadharFile.size}</FileSize>
                  </FileInfoSection>
                  <RemoveButton onClick={() => removeFile("aadharFile")}>
                    <X size={16} />
                  </RemoveButton>
                </FilePreviewContainer>
              )}
            </FileUploadGroup>

            <FileUploadGroup>
              <FileUploadLabel>Upload Passbook Document</FileUploadLabel>
              <FileUploadWrapper>
                <HiddenFileInput
                  type="file"
                  name="passbookFile"
                  ref={passbookInputRef}
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
                <FileUploadButton
                  type="button"
                  onClick={() => passbookInputRef.current.click()}
                >
                  <Upload size={20} />
                  <span>Upload Passbook</span>
                </FileUploadButton>
              </FileUploadWrapper>
              {fileInfo.passbookFile && (
                <FilePreviewContainer>
                  <FileIconSection>
                    {getFileIcon(fileInfo.passbookFile.type)}
                  </FileIconSection>
                  <FileInfoSection>
                    <FileName>{fileInfo.passbookFile.name}</FileName>
                    <FileSize>{fileInfo.passbookFile.size}</FileSize>
                  </FileInfoSection>
                  <RemoveButton onClick={() => removeFile("passbookFile")}>
                    <X size={16} />
                  </RemoveButton>
                </FilePreviewContainer>
              )}
            </FileUploadGroup>
          </FileUploadSection>

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

export default ApplyJobCard;

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

const FileUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const FileUploadGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileUploadLabel = styled.label`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
`;

const FileUploadWrapper = styled.div`
  position: relative;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileUploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-bg-muted);
  border: 1px dashed var(--color-border-light);
  border-radius: 8px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--color-bg-hover);
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const FilePreviewContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--color-bg-muted);
  border-radius: 8px;
  margin-top: 0.5rem;
  position: relative;
`;

const FileIconSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--color-bg);
  border-radius: 6px;
`;

const FileInfoSection = styled.div`
  flex: 1;
  margin-left: 0.75rem;
  overflow: hidden;
`;

const FileName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.p`
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin: 0;
  margin-top: 0.25rem;
`;

const RemoveButton = styled.button`
  background-color: var(--color-bg);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 0.5rem;

  &:hover {
    background-color: var(--color-bg-hover);
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;
