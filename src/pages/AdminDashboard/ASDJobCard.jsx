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
  Phone,
  Calendar,
  IdCard,
  MapPin,
  FileText,
  Upload,
  File,
  Users,
  CreditCard,
  Home,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { successToast } from "../../utils/ToastNotfications";

const ASDJobCard = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      await axiosInstance.patch(`/admin/service/${id}/status`, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["service", id]);
      successToast("Status updated successfully!");
    },
  });

  // Add Comment Mutation
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/admin/service/${id}/comment`, { comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["service", id]);
      setComment("");
      successToast("Comment added successfully!");
    },
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("document", uploadFile);
      formData.append("documentType", "additional_document");

      await axiosInstance.post(`/services/${id}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["service", id]);
      setUploadFile(null);
      setShowConfirmModal(false);
      setPreviewUrl(null);
      successToast("Document uploaded successfully!");
    },
    onError: (error) => {
      successToast("Document upload failed: " + error.message, "error");
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);

      // Create preview for the file
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setPreviewUrl("/pdf-icon.png"); // Use a placeholder PDF icon
      } else {
        setPreviewUrl("/file-icon.png"); // Use a generic file icon
      }

      setShowConfirmModal(true);
    }
  };

  const handleDownload = (filePath, fileName) => {
    const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${filePath}`;
    const link = document.createElement("a");
    link.href = fullUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading)
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading JobCard service details...</LoadingText>
      </LoadingContainer>
    );

  if (error)
    return (
      <ErrorContainer>
        <ErrorIcon />
        <ErrorText>Error fetching JobCard service details</ErrorText>
      </ErrorContainer>
    );

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <Title>JobCard Application Details</Title>
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
          <DetailValue>{service.user.email}</DetailValue>
        </DetailCard>
      </DetailsGrid>

      {/* Detailed Service Information */}
      <ServiceDetailsSection>
        <SectionTitle>
          <IdCard size={20} />
          JobCard Application Details
        </SectionTitle>
        <DetailGrid>
          <DetailItem>
            <User size={16} />
            <strong>Full Name:</strong> {service.specificService.name}
          </DetailItem>
          <DetailItem>
            <Users size={16} />
            <strong>Father/Husband Name:</strong>{" "}
            {service.specificService.fatherHusbandName}
          </DetailItem>
          <DetailItem>
            <Calendar size={16} />
            <strong>Applied On:</strong>{" "}
            {new Date(service.createdAt).toLocaleDateString()}
          </DetailItem>
          <DetailItem>
            <Clock size={16} />
            <strong>Last Updated:</strong>{" "}
            {new Date(service.updatedAt).toLocaleDateString()}
          </DetailItem>
        </DetailGrid>
      </ServiceDetailsSection>

      {/* Document Section */}
      <DocumentSection>
        <SectionTitle>
          <FileText size={20} />
          Required Documents
        </SectionTitle>
        <DocumentGrid>
          <DocumentItem>
            <DocumentLabel>Aadhar Card</DocumentLabel>
            {service.specificService.aadharFilePath.endsWith(".pdf") ? (
              <PDFDocumentPreview>
                <FileText size={48} />
                <PDFFilename>Aadhar Card PDF</PDFFilename>
              </PDFDocumentPreview>
            ) : (
              <DocumentImage
                src={`${import.meta.env.VITE_API_BASE_URL}${
                  service.specificService.aadharFilePath
                }`}
                alt="Aadhar Card"
              />
            )}
            <DownloadButton
              onClick={() =>
                handleDownload(
                  service.specificService.aadharFilePath,
                  "aadhar_card.pdf"
                )
              }
            >
              Download
            </DownloadButton>
          </DocumentItem>

          <DocumentItem>
            <DocumentLabel>Bank Passbook</DocumentLabel>
            {service.specificService.passbookFilePath.endsWith(".pdf") ? (
              <PDFDocumentPreview>
                <FileText size={48} />
                <PDFFilename>Bank Passbook PDF</PDFFilename>
              </PDFDocumentPreview>
            ) : (
              <DocumentImage
                src={`${import.meta.env.VITE_API_BASE_URL}${
                  service.specificService.passbookFilePath
                }`}
                alt="Bank Passbook"
              />
            )}
            <DownloadButton
              onClick={() =>
                handleDownload(
                  service.specificService.passbookFilePath,
                  "bank_passbook.pdf"
                )
              }
            >
              Download
            </DownloadButton>
          </DocumentItem>
        </DocumentGrid>
      </DocumentSection>

      {/* Additional Documents Section */}
      {service.documents && service.documents.length > 0 && (
        <AdditionalDocumentsSection>
          <SectionTitle>
            <FileText size={20} />
            Additional Documents
          </SectionTitle>
          <DocumentGrid>
            {service.documents.map((doc, index) => (
              <DocumentItem key={index}>
                <DocumentLabel>
                  {doc.documentType || `Document ${index + 1}`}
                </DocumentLabel>
                {doc.path.endsWith(".pdf") ? (
                  <PDFDocumentPreview>
                    <FileText size={48} />
                    <PDFFilename>PDF Document</PDFFilename>
                  </PDFDocumentPreview>
                ) : (
                  <DocumentImage
                    src={`${import.meta.env.VITE_API_BASE_URL}${doc.path}`}
                    alt={`Document ${index + 1}`}
                  />
                )}
                <DownloadButton
                  onClick={() =>
                    handleDownload(
                      doc.path,
                      `jobcard_document_${index + 1}${doc.path.substring(
                        doc.path.lastIndexOf(".")
                      )}`
                    )
                  }
                >
                  Download
                </DownloadButton>
              </DocumentItem>
            ))}
          </DocumentGrid>
        </AdditionalDocumentsSection>
      )}

      {/* Upload Document Section */}
      <DocumentUploadSection>
        <SectionTitle>
          <Upload size={20} />
          Upload Additional Document
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
            <Upload size={16} />
            Upload Document
          </UploadButton>
        </FileInputWrapper>
      </DocumentUploadSection>

      {/* Confirmation Modal */}
      {showConfirmModal && uploadFile && (
        <ConfirmationModal>
          <ModalContent>
            {previewUrl && previewUrl.startsWith("data:image") ? (
              <PreviewImage src={previewUrl} alt="File preview" />
            ) : (
              <File size={40} />
            )}
            <p>Upload Document: {uploadFile.name}</p>
            <ModalActions>
              <CancelButton
                onClick={() => {
                  setUploadFile(null);
                  setShowConfirmModal(false);
                  setPreviewUrl(null);
                }}
              >
                Cancel
              </CancelButton>
              <ConfirmButton
                onClick={() => uploadDocumentMutation.mutate()}
                disabled={uploadDocumentMutation.isLoading}
              >
                {uploadDocumentMutation.isLoading
                  ? "Uploading..."
                  : "Confirm Upload"}
              </ConfirmButton>
            </ModalActions>
          </ModalContent>
        </ConfirmationModal>
      )}

      {/* Status Actions */}
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

// Helper functions
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

// Styled Components
export const Container = styled(motion.div)`
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-bg);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  color: var(--color-text);
  font-weight: 600;
`;

export const StatusBadge = styled.span`
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

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const DetailCard = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 1.5rem;
`;

export const DetailLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

export const DetailValue = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 500;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--color-primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 500;
`;

export const ServiceDetailsSection = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const DocumentSection = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

export const AdditionalDocumentsSection = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

export const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

export const DocumentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const DownloadButton = styled.button`
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const DocumentLabel = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
  color: var(--color-text);
`;

export const DocumentImage = styled.img`
  max-width: 250px;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const PDFDocumentPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 250px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px dashed #cccccc;
`;

export const PDFFilename = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: var(--color-text-secondary);
`;

export const StatusActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const ActionButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    background-color: var(--color-border);
    cursor: not-allowed;
  }
`;

export const CommentsSection = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 1.5rem;
`;

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  color: var(--color-text-muted);
  padding: 1.5rem;
`;

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const CommentItem = styled.div`
  background-color: var(--color-surface-secondary);
  border-radius: 8px;
  padding: 1rem;
`;

export const CommentText = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

export const CommentMeta = styled.small`
  color: var(--color-text-muted);
  font-size: 0.75rem;
`;

export const CommentInput = styled.div`
  display: flex;
  gap: 1rem;
`;

export const InputField = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
`;

export const SendButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-secondary-dark);
  }

  &:disabled {
    background-color: var(--color-border);
    cursor: not-allowed;
  }
`;

// Document upload styles
export const DocumentUploadSection = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const PreviewImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  margin-bottom: 15px;
`;

// Loading and Error Components
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

export default ASDJobCard;
