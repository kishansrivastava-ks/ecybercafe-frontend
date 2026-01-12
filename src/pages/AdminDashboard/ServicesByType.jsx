import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Edit3,
  IndianRupee,
  CheckCircle,
  X,
  AlertTriangle,
  Loader,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { successToast, errorToast } from "../../utils/ToastNotfications";

// --- Route Mapping ---
// Maps backend serviceType to frontend routes
const ROUTE_MAP = {
  PanCard: "/admin-dashboard/services/pan",
  VoterCard: "/admin-dashboard/services/voter-card",
  Rtps: "/admin-dashboard/services/rtps",
  LabourCard: "/admin-dashboard/services/labour-card",
};

// --- API Functions ---
const fetchServicePrices = async () => {
  const res = await axiosInstance.get("/admin/config/prices");
  return res.data;
};

const updateServicePrice = async ({ serviceType, newPrice }) => {
  const res = await axiosInstance.put("/admin/config/prices", {
    serviceType,
    newPrice,
  });
  return res.data;
};

const ServicesByType = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modal State
  const [selectedService, setSelectedService] = useState(null); // The service being edited
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data Fetching
  const {
    data: services,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["servicePrices"],
    queryFn: fetchServicePrices,
  });

  // Handle Edit Click
  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <Title>Service Management</Title>
        <Subtitle>
          Manage pricing and view applications for all services
        </Subtitle>
      </Header>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Current Rate</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="center">
                  <Loader className="spin" /> Loading configuration...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="3" className="center error">
                  Failed to load service configuration.
                </td>
              </tr>
            ) : services?.length === 0 ? (
              <tr>
                <td colSpan="3" className="center">
                  No services found.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service._id}>
                  <td>
                    <ServiceName>
                      {service.label || service.serviceType}
                    </ServiceName>
                    <ServiceTypeTag>{service.serviceType}</ServiceTypeTag>
                  </td>
                  <td>
                    <PriceTag>
                      <IndianRupee size={14} />
                      {service.price}
                    </PriceTag>
                  </td>
                  <td>
                    <ActionGroup>
                      <ActionButton
                        className="edit"
                        onClick={() => handleEditClick(service)}
                        title="Update Price"
                      >
                        <Edit3 size={16} /> Update Price
                      </ActionButton>

                      <ActionButton
                        className="view"
                        onClick={() =>
                          navigate(ROUTE_MAP[service.serviceType] || "#")
                        }
                        disabled={!ROUTE_MAP[service.serviceType]}
                        title="View Applications"
                      >
                        <Eye size={16} /> View List
                      </ActionButton>
                    </ActionGroup>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      {/* --- Price Update Modal --- */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <UpdatePriceModal
            service={selectedService}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedService(null);
            }}
            onSuccess={() => {
              queryClient.invalidateQueries(["servicePrices"]); // Refresh Table
            }}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

// --- Sub-Component: Update Price Modal ---
const UpdatePriceModal = ({ service, onClose, onSuccess }) => {
  const [price, setPrice] = useState(service.price);
  const [step, setStep] = useState(1); // 1 = Input, 2 = Confirm

  const mutation = useMutation({
    mutationFn: updateServicePrice,
    onSuccess: () => {
      successToast(`${service.label} price updated to ₹${price}`);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      errorToast(err.response?.data?.message || "Failed to update price");
      setStep(1); // Go back to input on error
    },
  });

  const handleNext = () => {
    if (price < 0 || price === "") {
      errorToast("Please enter a valid price");
      return;
    }
    setStep(2);
  };

  return (
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
          <h3>Update Service Price</h3>
          <CloseBtn onClick={onClose}>
            <X size={20} />
          </CloseBtn>
        </ModalHeader>

        <ModalBody>
          {step === 1 ? (
            <>
              <p style={{ marginBottom: "1.5rem", color: "#666" }}>
                Update the base rate for <strong>{service.label}</strong>. This
                will affect all new applications immediately.
              </p>
              <Label>New Price (₹)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                autoFocus
              />
            </>
          ) : (
            <ConfirmContent>
              <AlertTriangle size={40} color="#f59e0b" />
              <h4>Confirm Change?</h4>
              <p>
                Are you sure you want to change the price from <br />
                <strong>₹{service.price}</strong> to{" "}
                <strong style={{ color: "var(--color-primary)" }}>
                  ₹{price}
                </strong>
                ?
              </p>
            </ConfirmContent>
          )}
        </ModalBody>

        <ModalFooter>
          {step === 1 ? (
            <>
              <CancelBtn onClick={onClose}>Cancel</CancelBtn>
              <PrimaryBtn onClick={handleNext}>Next</PrimaryBtn>
            </>
          ) : (
            <>
              <CancelBtn onClick={() => setStep(1)}>Back</CancelBtn>
              <PrimaryBtn
                onClick={() =>
                  mutation.mutate({
                    serviceType: service.serviceType,
                    newPrice: price,
                  })
                }
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Saving..." : "Confirm & Save"}
              </PrimaryBtn>
            </>
          )}
        </ModalFooter>
      </Modal>
    </Overlay>
  );
};

export default ServicesByType;

// --- Styled Components ---

const Container = styled(motion.div)`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: left;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 1.2rem 1.5rem;
    background: #f8f9fa;
    color: #666;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-border-light);
  }

  td {
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid var(--color-border-light);
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .center {
    text-align: center;
    color: #888;
    padding: 3rem;
  }
  .error {
    color: #ef4444;
  }
  .spin {
    animation: spin 1s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ServiceName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 4px;
`;

const ServiceTypeTag = styled.span`
  background: #f3f4f6;
  color: #666;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: monospace;
`;

const PriceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: #ecfdf5;
  color: #059669;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1rem;
  border: 1px solid #d1fae5;
`;

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.edit {
    background: white;
    border: 1px solid var(--color-border);
    color: var(--color-text);
    &:hover {
      background: #f9fafb;
      border-color: #ccc;
    }
  }

  &.view {
    background: var(--color-primary);
    border: none;
    color: white;
    &:hover {
      opacity: 0.9;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

/* --- Modal Styles --- */
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
`;

const Modal = styled(motion.div)`
  background: white;
  width: 400px;
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

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const ConfirmContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  h4 {
    margin: 0;
    font-size: 1.2rem;
  }
  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
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

const PrimaryBtn = styled.button`
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
