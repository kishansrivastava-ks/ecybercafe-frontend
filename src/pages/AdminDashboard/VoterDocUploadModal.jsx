import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { successToast, errorToast } from "../../utils/ToastNotfications";

const VoterDocUploadModal = ({ service, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const isReplace = service.status === "completed";

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      // Endpoint: /api/services/:serviceId/voter/upload-doc
      const res = await axiosInstance.post(
        `/services/${service._id}/voter/upload-doc`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    },
    onSuccess: () => {
      successToast("Document uploaded successfully!");
      onSuccess();
    },
    onError: (err) => {
      errorToast(err.response?.data?.message || "Upload failed");
    },
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== "application/pdf") {
      errorToast("Only PDF files are allowed.");
      return;
    }
    setFile(selected);
  };

  const handleSubmit = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("document", file);
    uploadMutation.mutate(formData);
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Modal
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Header>
          <Title>
            {isReplace ? "Replace Voter Document" : "Upload Voter Document"}
          </Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Body>
          {/* Service Summary */}
          <SummaryBox>
            <SummaryRow>
              <strong>Applicant:</strong> {service.specificService?.name}
            </SummaryRow>
            <SummaryRow>
              <strong>Reference:</strong>{" "}
              {service.specificService?.referenceNumber}
            </SummaryRow>
            <SummaryRow>
              <strong>Retailer:</strong> {service.user?.name}
            </SummaryRow>
          </SummaryBox>

          {isReplace && (
            <WarningBox>
              <AlertTriangle size={18} />
              <p>
                A document already exists. Uploading will replace it
                permanently.
              </p>
            </WarningBox>
          )}

          {/* File Drop Area */}
          <DropZone active={!!file}>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              id="file-upload"
              hidden
            />
            <label htmlFor="file-upload">
              {file ? (
                <FilePreview>
                  <FileText size={32} color="var(--color-primary)" />
                  <FileName>{file.name}</FileName>
                  <FileSize>{(file.size / 1024).toFixed(1)} KB</FileSize>
                  <ChangeText>Click to change</ChangeText>
                </FilePreview>
              ) : (
                <EmptyState>
                  <UploadCloud size={40} color="#ccc" />
                  <p>Click to select PDF file</p>
                  <span>Only .pdf files allowed</span>
                </EmptyState>
              )}
            </label>
          </DropZone>
        </Body>

        <Footer>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <UploadBtn
            onClick={handleSubmit}
            disabled={!file || uploadMutation.isLoading}
          >
            {uploadMutation.isLoading ? "Uploading..." : "Confirm Upload"}
          </UploadBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default VoterDocUploadModal;

// --- Styled Components ---

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
`;

const Body = styled.div`
  padding: 1.5rem;
`;

const SummaryBox = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;
const SummaryRow = styled.div`
  margin-bottom: 0.4rem;
  &:last-child {
    margin: 0;
  }
`;

const WarningBox = styled.div`
  display: flex;
  gap: 10px;
  background: #fff7ed;
  color: #c2410c;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  border: 1px solid #ffedd5;
`;

const DropZone = styled.div`
  border: 2px dashed ${(p) => (p.active ? "var(--color-primary)" : "#ddd")};
  border-radius: 12px;
  background: ${(p) => (p.active ? "#f0f9ff" : "#fafafa")};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-primary);
    background: #f0f9ff;
  }
  label {
    display: block;
    padding: 2rem;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  span {
    font-size: 0.8rem;
    color: #999;
  }
`;

const FilePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const FileName = styled.div`
  font-weight: 600;
  margin-top: 0.5rem;
  color: #333;
`;
const FileSize = styled.div`
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.5rem;
`;
const ChangeText = styled.div`
  font-size: 0.8rem;
  color: var(--color-primary);
  text-decoration: underline;
`;

const Footer = styled.div`
  padding: 1.25rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f9f9f9;
`;

const CancelBtn = styled.button`
  padding: 0.6rem 1.2rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  color: black;
  &:hover {
    background: #eee;
  }
`;

const UploadBtn = styled.button`
  padding: 0.6rem 1.2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }
`;
