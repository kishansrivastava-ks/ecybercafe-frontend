/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  Calendar,
  MapPin,
  UserCheck,
  Phone,
  CreditCard,
  Upload,
  X,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";
import {
  Button,
  Input,
  Spinner,
  // Toast,
  ToastNotification,
} from "../../ui/UIComponents";
import { useServiceConfig } from "../../hooks/useServiceConfig";
import ServiceMaintenance from "../../components/ServiceMaintenance";

const ApplyPanCard = () => {
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const aadharInputRef = useRef(null);
  const [showToast, setShowToast] = useState(true);

  const {
    price,
    isActive,
    isLoading: priceLoading,
  } = useServiceConfig("PanCard");
  const currentRate = price || 0;

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    fatherName: "",
    mobileNumber: "",
    aadharNumber: "",
    address: "",
    photo: null,
    signature: null,
    aadharFile: null,
  });

  const [previews, setPreviews] = useState({
    photo: null,
    signature: null,
  });

  const [fileInfo, setFileInfo] = useState({
    aadharFile: null,
  });

  const [toast, setToast] = useState(null);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append text fields
      Object.keys(data).forEach((key) => {
        if (key !== "photo" && key !== "signature" && key !== "aadharFile") {
          formDataToSend.append(key, data[key]);
        }
      });

      // Append files
      if (data.photo) formDataToSend.append("photo", data.photo);
      if (data.signature) formDataToSend.append("signature", data.signature);
      if (data.aadharFile) formDataToSend.append("aadharFile", data.aadharFile);

      const res = await axiosInstance.post(
        "/services/apply/pan-card",
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
        message: "PAN Card application submitted successfully!",
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
          message: "Only JPEG, JPG, PNG and PDF files are allowed",
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

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);

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
    setPreviews((prev) => ({
      ...prev,
      [type]: null,
    }));
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));

    // Reset file input
    if (type === "photo" && photoInputRef.current) {
      photoInputRef.current.value = "";
    }
    if (type === "signature" && signatureInputRef.current) {
      signatureInputRef.current.value = "";
    }
    if (type === "aadharFile" && aadharInputRef) {
      aadharInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Destructure form data
    const {
      fullName,
      dateOfBirth,
      fatherName,
      mobileNumber,
      aadharNumber,
      address,
      photo,
      signature,
      aadharFile,
    } = formData;

    // Comprehensive validation
    const validations = [
      { field: fullName, message: "Full Name is required" },
      { field: dateOfBirth, message: "Date of Birth is required" },
      { field: fatherName, message: "Father's Name is required" },
      { field: mobileNumber, message: "Mobile Number is required" },
      { field: aadharNumber, message: "Aadhar Number is required" },
      { field: address, message: "Address is required" },
      { field: photo, message: "Photo is required" },
      { field: signature, message: "Signature is required" },
      { field: aadharFile, message: "Aadhar File is required" },
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

    // Mobile number validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNumber)) {
      setToast({
        type: "error",
        message: "Invalid mobile number",
      });
      return;
    }

    // Aadhar number validation
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadharNumber)) {
      setToast({
        type: "error",
        message: "Invalid Aadhar number",
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

  if (!isActive) {
    return <ServiceMaintenance serviceName="PAN Card" />;
  }

  if (priceLoading) return <Container>Loading current rates...</Container>;

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormWrapper>
        <FormHeader>
          <FileText size={48} color="var(--color-primary)" />
          <Title>PAN Card Application</Title>
          <Subtitle>Complete your application with accurate details</Subtitle>

          <FeeBadge>Application Fee: ₹{currentRate}</FeeBadge>
        </FormHeader>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <User size={20} color="var(--color-text-muted)" />
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              $hasIcon
            />
          </InputGroup>

          <InputGroup>
            <Calendar size={20} color="var(--color-text-muted)" />
            <DateInputWrapper>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                placeholder="date of birth"
                $hasIcon
              />
            </DateInputWrapper>
          </InputGroup>

          <InputGroup>
            <UserCheck size={20} color="var(--color-text-muted)" />
            <Input
              type="text"
              name="fatherName"
              placeholder="Father's Name"
              value={formData.fatherName}
              onChange={handleChange}
              required
              $hasIcon
            />
          </InputGroup>

          <InputGroup>
            <Phone size={20} color="var(--color-text-muted)" />
            <Input
              type="tel"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              maxLength={10}
              $hasIcon
            />
          </InputGroup>

          <InputGroup>
            <CreditCard size={20} color="var(--color-text-muted)" />
            <Input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number"
              value={formData.aadharNumber}
              onChange={handleChange}
              required
              maxLength={12}
              $hasIcon
            />
          </InputGroup>

          <InputGroup style={{ gridColumn: "1 / -1" }}>
            <div>
              <MapPin size={20} color="var(--color-text-muted)" />
            </div>
            <Input
              type="text"
              name="address"
              placeholder="Block"
              value={formData.address}
              onChange={handleChange}
              required
              $hasIcon
            />
          </InputGroup>

          <FileUploadSection style={{ gridColumn: "1 / -1" }}>
            <FileUploadGroup>
              <FileUploadLabel>Upload Photo</FileUploadLabel>
              <FileUploadWrapper>
                <HiddenFileInput
                  type="file"
                  name="photo"
                  ref={photoInputRef}
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                />
                <FileUploadButton
                  type="button"
                  onClick={() => photoInputRef.current.click()}
                >
                  <Upload size={20} />
                  <span>Upload Photo</span>
                </FileUploadButton>
              </FileUploadWrapper>
              {previews.photo && (
                <PreviewContainer>
                  <PreviewImage src={previews.photo} alt="Photo Preview" />
                  <RemoveButton onClick={() => removeFile("photo")}>
                    <X size={16} />
                  </RemoveButton>
                </PreviewContainer>
              )}
            </FileUploadGroup>

            <FileUploadGroup>
              <FileUploadLabel>Upload Signature</FileUploadLabel>
              <FileUploadWrapper>
                <HiddenFileInput
                  type="file"
                  name="signature"
                  ref={signatureInputRef}
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                />
                <FileUploadButton
                  type="button"
                  onClick={() => signatureInputRef.current.click()}
                >
                  <Upload size={20} />
                  <span>Upload Signature</span>
                </FileUploadButton>
              </FileUploadWrapper>
              {previews.signature && (
                <PreviewContainer>
                  <PreviewImage
                    src={previews.signature}
                    alt="Signature Preview"
                  />
                  <RemoveButton onClick={() => removeFile("signature")}>
                    <X size={16} />
                  </RemoveButton>
                </PreviewContainer>
              )}
            </FileUploadGroup>

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
          </FileUploadSection>

          <div style={{ gridColumn: "1 / -1" }}>
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isLoading}
              $fullWidth
            >
              {mutation.isLoading ? (
                <Spinner size={20} />
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </Form>
      </FormWrapper>

      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setShowToast(false)}
        />
      )}
    </Container>
  );
};

export default ApplyPanCard;

// Styled Components (keeping previous styles and adding new ones)
const FileUploadSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
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

const FileIconSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--color-bg);
  border-radius: 6px;
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

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    aspect-ratio: 16/9;
  }

  @media (max-width: 480px) {
    aspect-ratio: 1/1;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

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
  width: 70vw;

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
  display: grid;
  grid-template-columns: 1fr 1fr; /* Creates two equal columns */
  gap: 1.5rem;

  /* Make the form stack vertically on smaller screens */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const FeeBadge = styled.div`
  margin-top: 1rem;
  background-color: #e6f4ea; /* Light green background */
  color: #1e7e34; /* Dark green text */
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #c3e6cb;
  display: inline-block;
`;
