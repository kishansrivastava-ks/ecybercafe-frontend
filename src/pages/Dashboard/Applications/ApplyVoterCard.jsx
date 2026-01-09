import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save, X, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { successToast, errorToast } from "../../../utils/ToastNotfications";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const COST_PER_APP = 370;

const ApplyVoterCard = () => {
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Initial state with one empty row
  const [rows, setRows] = useState([
    { id: Date.now(), state: "", name: "", referenceNumber: "" },
  ]);

  // --- Handlers ---

  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), state: "", name: "", referenceNumber: "" },
    ]);
  };

  const handleRemoveRow = (id) => {
    if (rows.length === 1) {
      errorToast("At least one application is required.");
      return;
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const totalCost = rows.length * COST_PER_APP;

  // --- API Mutation ---
  const applyMutation = useMutation({
    mutationFn: async (data) => {
      // Remove the local 'id' before sending to backend
      const cleanedData = data.map(({ id, ...rest }) => rest);
      const res = await axiosInstance.post("/services/apply/voter-card", {
        applications: cleanedData,
      });
      return res.data;
    },
    onSuccess: (data) => {
      successToast(data.message || "Applications submitted successfully!");
      navigate("/dashboard/services/voter-card/list");
    },
    onError: (err) => {
      errorToast(
        err.response?.data?.message || "Failed to submit applications"
      );
      setIsConfirmModalOpen(false);
    },
  });

  const handlePreSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    for (const row of rows) {
      if (!row.state || !row.name || !row.referenceNumber) {
        errorToast("Please fill in all fields for every row.");
        return;
      }
    }
    setIsConfirmModalOpen(true);
  };

  const handleFinalSubmit = () => {
    applyMutation.mutate(rows);
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <div>
          <Title>Apply for Voter PDF</Title>
          <Subtitle>Bulk application for Voter Card PDF generation</Subtitle>
        </div>
        <RateBadge>
          Rate: <strong>₹{COST_PER_APP}</strong> / Application
        </RateBadge>
      </Header>

      <FormContainer>
        <FormHeader>
          <ColHeader style={{ flex: 1.5 }}>State</ColHeader>
          <ColHeader style={{ flex: 2 }}>Full Name</ColHeader>
          <ColHeader style={{ flex: 2 }}>Reference Number</ColHeader>
          <ColHeader style={{ width: "50px", textAlign: "center" }}>
            Action
          </ColHeader>
        </FormHeader>

        <RowsWrapper>
          <AnimatePresence>
            {rows.map((row, index) => (
              <FormRow
                key={row.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <RowNumber>{index + 1}.</RowNumber>
                <Select
                  value={row.state}
                  onChange={(e) =>
                    handleInputChange(row.id, "state", e.target.value)
                  }
                  style={{ flex: 1.5 }}
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>

                <Input
                  type="text"
                  placeholder="Enter Full Name"
                  value={row.name}
                  onChange={(e) =>
                    handleInputChange(row.id, "name", e.target.value)
                  }
                  style={{ flex: 2 }}
                />

                <Input
                  type="text"
                  placeholder="Reference No."
                  value={row.referenceNumber}
                  onChange={(e) =>
                    handleInputChange(row.id, "referenceNumber", e.target.value)
                  }
                  style={{ flex: 2 }}
                />

                <DeleteButton
                  onClick={() => handleRemoveRow(row.id)}
                  title="Remove row"
                >
                  X
                </DeleteButton>
              </FormRow>
            ))}
          </AnimatePresence>
        </RowsWrapper>

        <ActionsArea>
          <AddButton onClick={handleAddRow}>
            <Plus size={18} /> Add Record
          </AddButton>

          <SummaryBox>
            <SummaryItem>
              Total Applications: <strong>{rows.length}</strong>
            </SummaryItem>
            <SummaryItem>
              Total Cost: <strong>₹ {totalCost}</strong>
            </SummaryItem>
          </SummaryBox>
        </ActionsArea>

        <SubmitSection>
          <SubmitButton onClick={handlePreSubmit}>Verify & Submit</SubmitButton>
        </SubmitSection>
      </FormContainer>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalHeader>
                <h3>Confirm Application</h3>
                <CloseBtn onClick={() => setIsConfirmModalOpen(false)}>
                  <X size={20} />
                </CloseBtn>
              </ModalHeader>
              <ModalBody>
                <AlertBox>
                  <AlertCircle size={20} />
                  <p>
                    Please review the details below. This action will deduct{" "}
                    <strong>₹{totalCost}</strong> from your wallet.
                  </p>
                </AlertBox>
                <SummaryTable>
                  <tbody>
                    <tr>
                      <td>Total Applications:</td>
                      <td>
                        <strong>{rows.length}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Total Cost:</td>
                      <td
                        style={{
                          color: "var(--color-error)",
                          fontWeight: "bold",
                        }}
                      >
                        ₹ {totalCost}
                      </td>
                    </tr>
                  </tbody>
                </SummaryTable>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginTop: "1rem",
                  }}
                >
                  Once submitted, the amount is non-refundable if the details
                  are incorrect.
                </p>
              </ModalBody>
              <ModalFooter>
                <CancelBtn onClick={() => setIsConfirmModalOpen(false)}>
                  Cancel
                </CancelBtn>
                <ConfirmBtn
                  onClick={handleFinalSubmit}
                  disabled={applyMutation.isLoading}
                >
                  {applyMutation.isLoading ? "Processing..." : "Confirm & Pay"}
                </ConfirmBtn>
              </ModalFooter>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ApplyVoterCard;

// --- Styled Components ---

const Container = styled(motion.div)`
  padding: 2rem;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
`;
const Subtitle = styled.p`
  color: var(--color-text-secondary);
`;

const RateBadge = styled.div`
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid var(--color-border-light);
  padding: 1.5rem;
`;

const FormHeader = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 1rem;
  padding-left: 2rem; /* Space for row number */

  @media (max-width: 768px) {
    display: none;
  } /* Hide headers on mobile */
`;

const ColHeader = styled.div`
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
`;

const RowsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FormRow = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    position: relative;
  }
`;

const RowNumber = styled.span`
  width: 20px;
  font-weight: bold;
  color: #999;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fee2e2;
  background: #fff5f5;
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
  }

  @media (max-width: 768px) {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
  }
`;

const ActionsArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-surface-secondary);
  color: var(--color-primary);
  border: 1px dashed var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e3f2fd;
  }
`;

const SummaryBox = styled.div`
  display: flex;
  gap: 1.5rem;
  background: #f8f9fa;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
`;

const SummaryItem = styled.div`
  font-size: 1rem;
  color: var(--color-text);
`;

const SubmitSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(var(--color-primary-rgb), 0.3);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

/* Modal Styles */
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
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #eee;
  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const AlertBox = styled.div`
  display: flex;
  gap: 0.8rem;
  background: #eef2ff;
  color: #3730a3;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SummaryTable = styled.table`
  width: 100%;
  td {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  tr:last-child td {
    border: none;
  }
`;

const ModalFooter = styled.div`
  padding: 1.25rem;
  background: #f9fafb;
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
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
