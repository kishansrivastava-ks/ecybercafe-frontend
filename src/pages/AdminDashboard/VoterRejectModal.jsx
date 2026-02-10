import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { successToast, errorToast } from "../../utils/ToastNotfications";

const VoterRejectModal = ({ service, onClose, onSuccess }) => {
  const [remark, setRemark] = useState("");

  const rejectMutation = useMutation({
    mutationFn: async () => {
      // Endpoint: /api/admin/service/:serviceId/voter/reject
      const res = await axiosInstance.post(
        `/admin/service/${service._id}/voter/reject`,
        { remark },
      );
      return res.data;
    },
    onSuccess: (data) => {
      successToast(data.message || "Application rejected and refund processed");
      onSuccess();
    },
    onError: (err) => {
      errorToast(err.response?.data?.message || "Failed to reject application");
    },
  });

  const handleSubmit = () => {
    if (!remark.trim()) {
      errorToast("Please provide a reason for rejection");
      return;
    }
    rejectMutation.mutate();
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
          <Title>Reject Application</Title>
          <CloseBtn onClick={onClose}>
            <X size={20} />
          </CloseBtn>
        </Header>

        <Body>
          <WarningBox>
            <AlertTriangle size={20} />
            <div>
              <strong>Warning:</strong> Rejecting this application will
              automatically refund the service fee to the retailer's wallet.
              This action cannot be undone.
            </div>
          </WarningBox>

          <InfoRow>
            <span>Applicant:</span>{" "}
            <strong>{service.specificService?.name}</strong>
          </InfoRow>
          <InfoRow>
            <span>Reference:</span>{" "}
            <code>{service.specificService?.referenceNumber}</code>
          </InfoRow>

          <Label>Reason for Rejection (Required)</Label>
          <TextArea
            placeholder="e.g. Incorrect document, Photo mismatch..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            autoFocus
          />
        </Body>

        <Footer>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <ConfirmBtn
            onClick={handleSubmit}
            disabled={rejectMutation.isLoading}
          >
            {rejectMutation.isLoading
              ? "Processing..."
              : "Confirm Reject & Refund"}
          </ConfirmBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default VoterRejectModal;

// --- Styled Components ---
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;
const Modal = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
  color: #ef4444;
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
`;
const Body = styled.div`
  padding: 1.5rem;
`;
const WarningBox = styled.div`
  display: flex;
  gap: 10px;
  background: #fef2f2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  border: 1px solid #fecaca;
  div {
    flex: 1;
    line-height: 1.4;
  }
`;
const InfoRow = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #374151;
  display: flex;
  justify-content: space-between;
  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;
const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #374151;
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-height: 100px;
  font-size: 0.95rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;
const Footer = styled.div`
  padding: 1.25rem;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  border-top: 1px solid #eee;
`;
const CancelBtn = styled.button`
  padding: 0.6rem 1.2rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: black;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;
const ConfirmBtn = styled.button`
  padding: 0.6rem 1.2rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #dc2626;
  }
`;
