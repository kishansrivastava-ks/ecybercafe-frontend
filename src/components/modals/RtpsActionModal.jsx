import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { successToast, errorToast } from "../../utils/ToastNotfications";

const RtpsActionModal = ({ service, type, onClose, onSuccess }) => {
  const [remark, setRemark] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      // POST /api/admin/service/:id/rtps/action
      const res = await axiosInstance.post(
        `/admin/service/${service._id}/rtps/action`,
        {
          action: type,
          remark: remark,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      successToast("Action completed successfully");
      onSuccess();
    },
    onError: (err) => {
      errorToast(err.response?.data?.message || "Action failed");
    },
  });

  const getTitle = () => {
    if (type === "approve") return "Approve Application";
    if (type === "reject") return "Reject Application";
    return "Add General Remark";
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <h3>{getTitle()}</h3>
          <CloseBtn onClick={onClose}>
            <X size={20} />
          </CloseBtn>
        </Header>
        <Body>
          <p
            style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}
          >
            Application:{" "}
            <strong>{service.specificService?.referenceNumber}</strong>
          </p>

          <Label>
            {type === "general_remark"
              ? "Note / Remark"
              : "Remark (Optional for Approval)"}
          </Label>
          <TextArea
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter details here..."
          />
        </Body>
        <Footer>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <ConfirmBtn
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
            type={type}
          >
            {mutation.isLoading ? "Processing..." : "Confirm"}
          </ConfirmBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default RtpsActionModal;

// --- Styled Components ---
const Overlay = styled.div`
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
`;
const Modal = styled.div`
  background: white;
  width: 400px;
  border-radius: 12px;
  overflow: hidden;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  h3 {
    margin: 0;
  }
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
const Body = styled.div`
  padding: 1.5rem;
`;
const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
`;
const Footer = styled.div`
  padding: 1rem;
  background: #f9f9f9;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
`;
const CancelBtn = styled.button`
  padding: 0.6rem 1.2rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: black;
`;
const ConfirmBtn = styled.button`
  padding: 0.6rem 1.2rem;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${(p) =>
    p.type === "reject" ? "#ef4444" : "var(--color-primary)"};
`;
