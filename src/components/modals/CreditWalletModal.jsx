import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { X, IndianRupee } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { successToast, errorToast } from "../../utils/ToastNotfications";

const CreditWalletModal = ({ user, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Mutation to call the backend endpoint
  const creditMutation = useMutation({
    mutationFn: async () => {
      // Validate inputs
      if (!amount || Number(amount) <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      const payload = {
        amount: Number(amount),
        description: description || "Manual Admin Credit",
      };

      const res = await axiosInstance.post(
        `/admin/users/${user._id}/credit`,
        payload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      successToast(data.message || `Successfully credited ₹${amount}`);
      if (onSuccess) onSuccess(); // Trigger refresh in parent
      onClose();
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || err.message || "Failed to credit wallet";
      errorToast(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    creditMutation.mutate();
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <ModalHeader>
          <TitleArea>
            <IconWrapper>
              <IndianRupee size={20} />
            </IconWrapper>
            <h3>Add Funds</h3>
          </TitleArea>
          <CloseBtn onClick={onClose}>
            <X size={20} />
          </CloseBtn>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <ModalBody>
            <UserInfo>
              Adding funds for retailer:
              <strong>{user.name}</strong>
              <span className="email">({user.email})</span>
            </UserInfo>

            <InputGroup>
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount (e.g. 500)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                autoFocus
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Remark / Description</Label>
              <Input
                type="text"
                placeholder="Reason (e.g. Payment Issue Resolution)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </InputGroup>

            <Notice>
              This action will immediately update the user's wallet balance and
              create a credit transaction log.
            </Notice>
          </ModalBody>

          <ModalFooter>
            <CancelBtn type="button" onClick={onClose}>
              Cancel
            </CancelBtn>
            <ConfirmBtn type="submit" disabled={creditMutation.isLoading}>
              {creditMutation.isLoading ? "Processing..." : "Confirm Credit"}
            </ConfirmBtn>
          </ModalFooter>
        </ModalForm>
      </Modal>
    </Overlay>
  );
};

export default CreditWalletModal;

// --- Styled Components ---

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1f2937;
    font-weight: 600;
  }
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  background: #ecfdf5;
  color: #059669;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
    color: #4b5563;
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  background: #fff;
`;

const UserInfo = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.5;

  strong {
    display: block;
    color: #111827;
    font-size: 1rem;
    margin-top: 2px;
  }

  .email {
    color: #6b7280;
    font-weight: normal;
    font-size: 0.85rem;
    margin-left: 6px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary, #2563eb);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Notice = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
`;

const ModalFooter = styled.div`
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelBtn = styled.button`
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`;

const ConfirmBtn = styled.button`
  padding: 0.625rem 1.25rem;
  background: var(--color-primary, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    filter: brightness(110%);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;
