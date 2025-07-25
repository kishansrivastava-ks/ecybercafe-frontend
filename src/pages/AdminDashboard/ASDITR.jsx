/**
 * ASDITR.js - Admin Service Details for ITR
 * This component displays the detailed information for a single ITR service application.
 * It fetches data using React Query and provides functionality for admins to update status,
 * add comments, and manage documents.
 */
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { useState } from "react";
import {
  Check,
  Clock,
  Send,
  AlertTriangle,
  MessageCircle,
  User,
  FileText,
  Upload,
  File,
  CreditCard,
  Landmark,
  Hash,
  Mail,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { successToast, errorToast } from "../../utils/ToastNotfications";
import {
  ActionButton,
  CommentInput,
  EmptyState,
  InputField,
  SendButton,
} from "./ASDJobCard";

// --- Reusable Document Component ---
// To avoid repetition, we can create a small component to handle document display.
const DocumentPreview = ({ filePath, label, baseUrl }) => {
  // const handleDownload = (path, fileName) => {
  //   const fullUrl = `${baseUrl}${path}`;
  //   const link = document.createElement("a");
  //   link.href = fullUrl;
  //   link.setAttribute("download", fileName);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = (path) => {
    const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${path}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const fileExtension = filePath.split(".").pop().toLowerCase();
  const fileName = `${label
    .replace(/\s/g, "_")
    .toLowerCase()}.${fileExtension}`;

  return (
    <DocumentItem>
      <DocumentLabel>{label}</DocumentLabel>
      {fileExtension === "pdf" ? (
        <PDFDocumentPreview>
          <FileText size={48} />
          <PDFFilename>{label} PDF</PDFFilename>
        </PDFDocumentPreview>
      ) : (
        <DocumentImage src={`${baseUrl}${filePath}`} alt={label} />
      )}
      <DownloadButton onClick={() => handleDownload(filePath, fileName)}>
        Download
      </DownloadButton>
    </DocumentItem>
  );
};

const ASDITR = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch Service Details
  const {
    data: service,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/admin/service/${id}`);
      return data;
    },
  });

  // Mutations for updating status, adding comments, and uploading documents
  // (These are identical to your ASDJobCard component, so they can be reused directly)
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      await axiosInstance.patch(`/admin/service/${id}/status`, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", id] });
      successToast("Status updated successfully!");
    },
    onError: (err) => errorToast(err.message || "Failed to update status."),
  });

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/admin/service/${id}/comment`, { comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", id] });
      setComment("");
      successToast("Comment added successfully!");
    },
    onError: (err) => errorToast(err.message || "Failed to add comment."),
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("document", uploadFile);
      formData.append("documentType", "additional_document");
      await axiosInstance.post(`/services/${id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", id] });
      setUploadFile(null);
      setShowConfirmModal(false);
      setPreviewUrl(null);
      successToast("Document uploaded successfully!");
    },
    onError: (err) => errorToast(err.message || "Document upload failed."),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null); // No preview for non-image files
      }
      setShowConfirmModal(true);
    }
  };

  if (isLoading)
    return (
      <LoadingContainer>
        <LoadingSpinner />{" "}
        <LoadingText>Loading ITR service details...</LoadingText>
      </LoadingContainer>
    );
  if (error)
    return (
      <ErrorContainer>
        <ErrorIcon /> <ErrorText>Error fetching ITR service details</ErrorText>
      </ErrorContainer>
    );

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <Title>ITR Application Details</Title>
        <StatusBadge status={service.status}>
          {getStatusIcon(service.status)}
          {formatStatus(service.status)}
        </StatusBadge>
      </Header>

      {/* User and Service Basic Information */}
      <DetailsGrid>
        <DetailCard>
          <DetailLabel>Applicant</DetailLabel>
          <DetailValue>
            <UserAvatar>{service.user.name.charAt(0).toUpperCase()}</UserAvatar>
            {service.user.name}
          </DetailValue>
        </DetailCard>
        <DetailCard>
          <DetailLabel>Service Type</DetailLabel>
          <DetailValue>{service.serviceType}</DetailValue>
        </DetailCard>
        <DetailCard>
          <DetailLabel>Email</DetailLabel>
          <DetailValue>
            <Mail size={16} /> {service.user.email}
          </DetailValue>
        </DetailCard>
      </DetailsGrid>

      {/* Detailed ITR Service Information */}
      <ServiceDetailsSection>
        <SectionTitle>
          <FileText size={20} /> ITR Filing Information
        </SectionTitle>
        <DetailGrid>
          <DetailItem>
            <CreditCard size={16} /> <strong>Aadhar No:</strong>{" "}
            {service.specificService.aadharCardNo}
          </DetailItem>
          <DetailItem>
            <CreditCard size={16} /> <strong>PAN No:</strong>{" "}
            {service.specificService.panCardNo}
          </DetailItem>
          <DetailItem>
            <Landmark size={16} /> <strong>Account No:</strong>{" "}
            {service.specificService.accountNo}
          </DetailItem>
          <DetailItem>
            <Hash size={16} /> <strong>IFSC Code:</strong>{" "}
            {service.specificService.ifscCode}
          </DetailItem>
        </DetailGrid>
      </ServiceDetailsSection>

      {/* Submitted Documents Section */}
      <DocumentSection>
        <SectionTitle>
          <FileText size={20} /> Submitted Documents
        </SectionTitle>
        <DocumentGrid>
          <DocumentPreview
            filePath={service.specificService.aadharFile}
            label="Aadhar Card"
            baseUrl={VITE_API_BASE_URL}
          />
          <DocumentPreview
            filePath={service.specificService.panCardFile}
            label="PAN Card"
            baseUrl={VITE_API_BASE_URL}
          />
          <DocumentPreview
            filePath={service.specificService.passbookFile}
            label="Bank Passbook"
            baseUrl={VITE_API_BASE_URL}
          />
        </DocumentGrid>
      </DocumentSection>

      {/* Additional Documents Section (Uploaded by Admin/User) */}
      {service.documents && service.documents.length > 0 && (
        <AdditionalDocumentsSection>
          <SectionTitle>
            <FileText size={20} /> Additional Documents
          </SectionTitle>
          <DocumentGrid>
            {service.documents.map((doc, index) => (
              <DocumentPreview
                key={index}
                filePath={doc.path}
                label={doc.originalName || `Document ${index + 1}`}
                baseUrl={VITE_API_BASE_URL}
              />
            ))}
          </DocumentGrid>
        </AdditionalDocumentsSection>
      )}

      {/* Upload Document Section */}
      <DocumentUploadSection>
        <SectionTitle>
          <Upload size={20} /> Upload Additional Document
        </SectionTitle>
        <FileInputWrapper>
          <input
            type="file"
            id="serviceDocumentUpload"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <UploadButton
            as="label"
            htmlFor="serviceDocumentUpload"
            whileTap={{ scale: 0.95 }}
          >
            <Upload size={16} /> Select Document
          </UploadButton>
        </FileInputWrapper>
      </DocumentUploadSection>

      {/* Confirmation Modal */}
      {showConfirmModal && uploadFile && (
        <ConfirmationModal>
          <ModalContent>
            {previewUrl ? (
              <PreviewImage src={previewUrl} alt="File preview" />
            ) : (
              <File size={40} />
            )}
            <p>
              Upload Document: <strong>{uploadFile.name}</strong>
            </p>
            <ModalActions>
              <CancelButton
                onClick={() => {
                  setShowConfirmModal(false);
                  setUploadFile(null);
                }}
              >
                Cancel
              </CancelButton>
              <ConfirmButton
                onClick={() => uploadDocumentMutation.mutate()}
                disabled={uploadDocumentMutation.isPending}
              >
                {uploadDocumentMutation.isPending
                  ? "Uploading..."
                  : "Confirm Upload"}
              </ConfirmButton>
            </ModalActions>
          </ModalContent>
        </ConfirmationModal>
      )}

      {/* Status Actions & Comments Section (Identical to ASDJobCard) */}
      <StatusActions>
        {service.status !== "completed" && (
          <ActionButton
            whileTap={{ scale: 0.95 }}
            onClick={() => updateStatusMutation.mutate("in_progress")}
            disabled={updateStatusMutation.isLoading}
          >
            <Clock size={16} />
            {updateStatusMutation.isLoading
              ? "Updating..."
              : "Mark as In Progress"}
          </ActionButton>
        )}
        {service.status === "in_progress" && (
          <ActionButton
            whileTap={{ scale: 0.95 }}
            onClick={() => updateStatusMutation.mutate("completed")}
            disabled={updateStatusMutation.isLoading}
          >
            <Check size={16} />
            {updateStatusMutation.isLoading
              ? "Updating..."
              : "Mark as Completed"}
          </ActionButton>
        )}
      </StatusActions>

      {/* Comments Section */}
      <CommentsSection>
        <SectionTitle>
          <MessageCircle size={20} />
          Comments
        </SectionTitle>

        {service.comments.length === 0 ? (
          <EmptyState>
            <p>No comments yet.</p>
          </EmptyState>
        ) : (
          <CommentsList>
            {service.comments.map((c, index) => (
              <CommentItem key={index}>
                <CommentText>{c.text}</CommentText>
                <CommentMeta>
                  {new Date(c.createdAt).toLocaleString()}
                </CommentMeta>
              </CommentItem>
            ))}
          </CommentsList>
        )}

        <CommentInput>
          <InputField
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <SendButton
            whileTap={{ scale: 0.95 }}
            onClick={() => addCommentMutation.mutate()}
            disabled={!comment.trim() || addCommentMutation.isLoading}
          >
            <Send size={16} />
            {addCommentMutation.isLoading ? "Adding..." : "Send"}
          </SendButton>
        </CommentInput>
      </CommentsSection>
    </Container>
  );
};

const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <Check size={16} style={{ marginRight: "0.5rem" }} />;
    case "in_progress":
      return <Clock size={16} style={{ marginRight: "0.5rem" }} />;
    default:
      return <AlertTriangle size={16} style={{ marginRight: "0.5rem" }} />;
  }
};

const formatStatus = (status) => {
  return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Minimal required styles for context
const Container = styled(motion.div)`
  padding: 2rem;
  background-color: #f9fafb;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
`;
const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;
const DetailCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;
const DetailLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;
const DetailValue = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;
const ServiceDetailsSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;
const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;
const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;
const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #374151;
`;
const DocumentSection = styled(ServiceDetailsSection)``;
const AdditionalDocumentsSection = styled(ServiceDetailsSection)``;
const DocumentUploadSection = styled(ServiceDetailsSection)``;
const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;
const DocumentItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  background-color: #f9fafb;
`;
const DocumentLabel = styled.h3`
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #374151;
`;
const DocumentImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.75rem;
`;
const PDFDocumentPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  background-color: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  color: #4b5563;
`;
const PDFFilename = styled.p`
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;
const DownloadButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  border: none;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #2563eb;
  }
`;
const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;

  background-color: ${(props) =>
    props.status === "completed"
      ? "var(--color-success)"
      : props.status === "in_progress"
      ? "var(--color-warning)"
      : "var(--color-error)"};
  color: white;
`;
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const LoadingSpinner = () => (
  <div
    style={{
      width: "50px",
      height: "50px",
      border: "4px solid var(--color-primary-light)",
      borderTop: "4px solid var(--color-primary)",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }}
  >
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export const LoadingText = styled.p`
  margin-top: 1rem;
  color: var(--color-text-secondary);
`;
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const ErrorIcon = () => (
  <AlertTriangle
    size={64}
    color="var(--color-error)"
    style={{ marginBottom: "1rem" }}
  />
);

export const ErrorText = styled.p`
  color: var(--color-error);
  font-size: 1.25rem;
`;
export const FileInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const UploadButton = styled(motion.label)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

export const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;
export const PreviewImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 15px;
`;
export const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export const CancelButton = styled.button`
  padding: 10px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

export const ConfirmButton = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;
const StatusActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;
const CommentsSection = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 1.5rem;
`;

export default ASDITR;
