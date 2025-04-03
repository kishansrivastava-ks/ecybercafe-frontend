import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  Calendar,
  MapPin,
  Building,
  FileCode,
  Clock,
  MessageCircle,
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

const fetchServiceDetails = async (serviceId) => {
  const res = await axiosInstance.get(`/admin/service/${serviceId}`);
  console.log(res.data);
  return res.data;
};

const ServiceDetailsRtps = () => {
  const { serviceId } = useParams();

  const {
    data: service,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["serviceDetails", serviceId],
    queryFn: () => fetchServiceDetails(serviceId),
  });

  if (isLoading) {
    return <LoadingContainer>Loading service details...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Error fetching service details</ErrorContainer>;
  }

  if (!service) {
    return <ErrorContainer>No service found</ErrorContainer>;
  }

  const { specificService, comments } = service;

  const downloadDocument = async (documentId) => {
    try {
      const response = await axiosInstance.get(
        `/services/${serviceId}/documents/${documentId}/download`,
        { responseType: "blob" }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `document_${documentId}`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Optionally show an error toast or message
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader>
        <FileText size={40} color="var(--color-primary)" />
        <Title>RTPS Application Details</Title>
      </PageHeader>

      <DetailsGrid>
        <ServiceDetailsSection>
          <SectionTitle>
            <User size={20} />
            User Information
          </SectionTitle>
          <DetailItem>
            <Label>User Name</Label>
            <Value>{service.user.name}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Email</Label>
            <Value>{service.user.email}</Value>
          </DetailItem>
          <DetailItem>
            <Label>User ID</Label>
            <Value>{service.user._id}</Value>
          </DetailItem>
        </ServiceDetailsSection>

        <ServiceDetailsSection>
          <SectionTitle>
            <Building size={20} />
            Registration Information
          </SectionTitle>
          <DetailItem>
            <Label>Registration Type</Label>
            <Value>{specificService.registrationType}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Registration Number</Label>
            <Value>{specificService.registrationNumber}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Block</Label>
            <Value>{specificService.block}</Value>
          </DetailItem>
        </ServiceDetailsSection>

        <ServiceDetailsSection>
          <SectionTitle>
            <Clock size={20} />
            Application Status
          </SectionTitle>
          <StatusBadge status={service.status}>{service.status}</StatusBadge>
          <DetailItem>
            <Label>Application ID</Label>
            <Value>{service._id}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Applied On</Label>
            <Value>{new Date(service.createdAt).toLocaleString()}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Last Updated</Label>
            <Value>{new Date(service.updatedAt).toLocaleString()}</Value>
          </DetailItem>
        </ServiceDetailsSection>

        <ServiceDetailsSection>
          <SectionTitle>
            <Calendar size={20} />
            Service Timeline
          </SectionTitle>
          <DetailItem>
            <Label>Service Created</Label>
            <Value>
              {new Date(specificService.createdAt).toLocaleString()}
            </Value>
          </DetailItem>
          <DetailItem>
            <Label>Service Updated</Label>
            <Value>
              {new Date(specificService.updatedAt).toLocaleString()}
            </Value>
          </DetailItem>
        </ServiceDetailsSection>

        {service.documents && service.documents.length > 0 && (
          <DocumentSection>
            <SectionTitle>
              <FileText size={20} />
              Uploaded Documents
            </SectionTitle>
            <DocumentGrid>
              {service.documents.map((doc) => (
                <DocumentItem key={doc._id}>
                  <DocumentLabel>{doc.documentType}</DocumentLabel>
                  <DocumentPreview
                    src={`${import.meta.env.VITE_API_BASE_URL}${doc.filePath}`}
                    alt={`${doc.documentType} Document`}
                  />
                  <DownloadButton onClick={() => downloadDocument(doc._id)}>
                    Download {doc.documentType}
                  </DownloadButton>
                </DocumentItem>
              ))}
            </DocumentGrid>
          </DocumentSection>
        )}

        {(!service.documents || service.documents.length === 0) && (
          <DocumentSection>
            <SectionTitle>
              <FileText size={20} />
              Uploaded Documents
            </SectionTitle>
            <NoDocumentsMessage>
              No documents have been uploaded for this service.
            </NoDocumentsMessage>
          </DocumentSection>
        )}

        {comments && comments.length > 0 ? (
          <CommentsSection>
            <SectionTitle>
              <MessageCircle size={20} />
              Admin Comments
            </SectionTitle>
            {comments.map((comment, index) => (
              <CommentItem key={index}>
                <CommentText>{comment.text}</CommentText>
                <CommentDate>
                  {new Date(comment.createdAt).toLocaleString()}
                </CommentDate>
              </CommentItem>
            ))}
          </CommentsSection>
        ) : (
          <CommentsSection>
            <SectionTitle>
              <MessageCircle size={20} />
              Admin Comments
            </SectionTitle>
            <NoDocumentsMessage>
              No comments have been added for this service.
            </NoDocumentsMessage>
          </CommentsSection>
        )}
      </DetailsGrid>
    </Container>
  );
};

export default ServiceDetailsRtps;

// Styled Components
const Container = styled(motion.div)`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--color-bg);
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--color-text);
  text-align: center;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceDetailsSection = styled.div`
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border-light);
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border-light);
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const Label = styled.span`
  color: var(--color-text-muted);
  font-weight: 500;
`;

const Value = styled.span`
  color: var(--color-text);
  font-weight: 600;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 1rem;
  background-color: ${(props) =>
    props.status === "approved"
      ? "var(--color-success)"
      : props.status === "pending"
      ? "var(--color-warning)"
      : props.status === "rejected"
      ? "var(--color-error)"
      : "var(--color-primary)"};
  color: white;
`;

const DocumentSection = styled.div`
  grid-column: span 2;
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border-light);

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DocumentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DocumentLabel = styled.span`
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
`;

const DocumentPreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CommentsSection = styled.div`
  grid-column: span 2;
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border-light);

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const CommentItem = styled.div`
  background-color: var(--color-bg);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CommentText = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`;

const CommentDate = styled.span`
  color: var(--color-text-muted);
  font-size: 0.75rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: var(--color-text-secondary);
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: var(--color-error);
`;

const DownloadButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: var(--color-primary-dark);
  }
`;

const NoDocumentsMessage = styled.p`
  color: var(--color-text-secondary);
  font-style: italic;
  text-align: center;
  padding: 20px;
`;
