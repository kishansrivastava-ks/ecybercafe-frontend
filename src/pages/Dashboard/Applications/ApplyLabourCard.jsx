import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { successToast, errorToast } from "../../../utils/ToastNotfications";
import { locationData } from "../../../data/locationData";
import { useServicePrice } from "../../../hooks/useServicePrice";

// const COST_PER_APP = 370;

const ApplyLabourCard = () => {
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { price, isLoading: priceLoading } = useServicePrice("LabourCard");
  const currentRate = price || 0;

  // Initial state
  const [rows, setRows] = useState([
    {
      id: Date.now(),
      district: "",
      block: "",
      name: "",
      applicationNumber: "",
    },
  ]);

  // --- Handlers ---
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        district: "",
        block: "",
        name: "",
        applicationNumber: "",
      },
    ]);
  };

  const handleRemoveRow = (id) => {
    if (rows.length === 1) {
      errorToast("At least one application is required.");
      return;
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleDistrictChange = (id, newDistrict) => {
    setRows(
      rows.map((row) =>
        row.id === id
          ? { ...row, district: newDistrict, block: "" } // Reset block when district changes
          : row
      )
    );
  };

  const handleInputChange = (id, field, value) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const totalCost = rows.length * currentRate;

  // --- API Mutation ---
  const applyMutation = useMutation({
    mutationFn: async (data) => {
      const cleanedData = data.map(({ id, ...rest }) => rest);
      const res = await axiosInstance.post("/services/apply/labour-card", {
        applications: cleanedData,
      });
      return res.data;
    },
    onSuccess: (data) => {
      successToast(data.message || "Applications submitted successfully!");
      navigate("/dashboard/services/labour-card/list");
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
    // Validation: District is optional, others are required
    for (const row of rows) {
      if (!row.block || !row.name || !row.applicationNumber) {
        errorToast(
          "Block, Name, and Application Number are required for all rows."
        );
        return;
      }
    }
    setIsConfirmModalOpen(true);
  };

  if (priceLoading) return <Container>Loading current rates...</Container>;

  return (
    <Container initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Header>
        <div>
          <Title>Apply for Labour Card</Title>
          <Subtitle>Bulk application for Labour Card services</Subtitle>
        </div>
        <RateBadge>
          Rate: <strong>₹{currentRate}</strong> / Application
        </RateBadge>
      </Header>

      <FormContainer>
        <FormHeader>
          <ColHeader style={{ flex: 1 }}>District (Opt)</ColHeader>
          <ColHeader style={{ flex: 1 }}>Block</ColHeader>
          <ColHeader style={{ flex: 1.5 }}>Applicant Name</ColHeader>
          <ColHeader style={{ flex: 1.5 }}>Application No.</ColHeader>
          <ColHeader style={{ width: "40px" }}></ColHeader>
        </FormHeader>

        <RowsWrapper>
          <AnimatePresence>
            {rows.map((row, index) => (
              <FormRow key={row.id}>
                <RowNumber>{index + 1}.</RowNumber>
                <Select
                  value={row.district}
                  onChange={(e) => handleDistrictChange(row.id, e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Select District</option>
                  {Object.keys(locationData).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </Select>

                <Select
                  value={row.block}
                  onChange={(e) =>
                    handleInputChange(row.id, "block", e.target.value)
                  }
                  style={{ flex: 1 }}
                  disabled={!row.district} // Disable until district is picked
                >
                  <option value="">Select Block</option>
                  {row.district &&
                    locationData[row.district] &&
                    locationData[row.district].map((blk) => (
                      <option key={blk} value={blk}>
                        {blk}
                      </option>
                    ))}
                </Select>
                <Input
                  type="text"
                  placeholder="Name"
                  value={row.name}
                  onChange={(e) =>
                    handleInputChange(row.id, "name", e.target.value)
                  }
                  style={{ flex: 1.5 }}
                />
                <Input
                  type="text"
                  placeholder="Application No"
                  value={row.applicationNumber}
                  onChange={(e) =>
                    handleInputChange(
                      row.id,
                      "applicationNumber",
                      e.target.value
                    )
                  }
                  style={{ flex: 1.5 }}
                />
                <DeleteButton onClick={() => handleRemoveRow(row.id)}>
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
              Total: <strong>{rows.length}</strong>
            </SummaryItem>
            <SummaryItem>
              Cost: <strong>₹ {totalCost}</strong>
            </SummaryItem>
          </SummaryBox>
        </ActionsArea>

        <SubmitSection>
          <SubmitButton onClick={handlePreSubmit}>Verify & Submit</SubmitButton>
        </SubmitSection>
      </FormContainer>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <Overlay>
          <Modal>
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
                  This will deduct <strong>₹{totalCost}</strong> from your
                  wallet.
                </p>
              </AlertBox>
              <p>
                Total Applications: <strong>{rows.length}</strong>
              </p>
            </ModalBody>
            <ModalFooter>
              <CancelBtn onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </CancelBtn>
              <ConfirmBtn
                onClick={() => applyMutation.mutate(rows)}
                disabled={applyMutation.isLoading}
              >
                {applyMutation.isLoading ? "Processing..." : "Confirm & Pay"}
              </ConfirmBtn>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
};

export default ApplyLabourCard;

// --- Styled Components (Same as RTPS) ---
const Container = styled(motion.div)`
  padding: 2rem;
  /* max-width: 1100px; */
  margin: 0 auto;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;
const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
`;
const Subtitle = styled.p`
  color: #666;
`;
const RateBadge = styled.div`
  background: #f0f9ff;
  color: #0284c7;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #bae6fd;
`;
const FormContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #eee;
`;
const FormHeader = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
  padding-left: 2rem;
  font-weight: 600;
  color: #666;
  @media (max-width: 768px) {
    display: none;
  }
`;
const ColHeader = styled.div``;
const RowsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;
const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
  }
`;
const RowNumber = styled.span`
  width: 20px;
  font-weight: bold;
  color: #999;
  @media (max-width: 768px) {
    display: none;
  }
`;
const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  flex: 1;
`;
const DeleteButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #fee2e2;
  background: #fff5f5;
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ActionsArea = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;
const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f0fdf4;
  color: #16a34a;
  border: 1px dashed #16a34a;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
`;
const SummaryBox = styled.div`
  display: flex;
  gap: 1.5rem;
  background: #f8f9fa;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
`;
const SummaryItem = styled.div``;
const SubmitSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;
const SubmitButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;
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
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.25rem;
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
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  flex: 1;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: 2px solid var(--color-primary);
    border-color: transparent;
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    color: #9ca3af;
  }
`;
