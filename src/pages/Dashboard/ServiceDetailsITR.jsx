/**
 * ServiceDetailsITR.js - User-facing details page for a submitted ITR service.
 * This component fetches and displays all the information related to a specific
 * ITR application, including submitted data, documents, and admin comments.
 */
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  Clock,
  MessageCircle,
  File,
  CreditCard,
  Landmark,
  Hash,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import {
  Container,
  PageHeader,
  Title,
  DetailsGrid,
  ServiceDetailsSection,
  SectionTitle,
  DetailItem,
  Label,
  Value,
  StatusBadge,
  DocumentSection,
  DocumentGrid,
  DocumentItem,
  DocumentLabel,
  DownloadButton,
  CommentsSection,
  CommentItem,
  CommentDate,
  LoadingContainer,
  ErrorContainer,
} from "./ServiceDetailsPan";

// Fetcher function for React Query
const fetchServiceDetails = async (serviceId) => {
  const { data } = await axiosInstance.get(`/admin/service/${serviceId}`);
  return data;
};

const ServiceDetailsITR = () => {
  const { serviceId } = useParams();

  const {
    data: service,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["serviceDetails", serviceId],
    queryFn: () => fetchServiceDetails(serviceId),
  });

  //   const handleDownload = (filePath, fileName) => {
  //     const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${filePath}`;
  //     const link = document.createElement("a");
  //     link.href = fullUrl;
  //     link.setAttribute("download", fileName);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };

  const handleDownload = (filePath) => {
    const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${filePath}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading)
    return <LoadingContainer>Loading service details...</LoadingContainer>;
  if (error)
    return (
      <ErrorContainer>
        Error fetching service details: {error.message}
      </ErrorContainer>
    );
  if (!service) return <ErrorContainer>No service found.</ErrorContainer>;

  const { specificService, comments } = service;

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader>
        <FileText size={40} color="var(--color-primary)" />
        <Title>{service.serviceType} Application Details</Title>
      </PageHeader>

      <DetailsGrid>
        {/* ITR Application Details */}
        <ServiceDetailsSection>
          <SectionTitle>
            <User size={20} /> ITR Information
          </SectionTitle>
          <DetailItem>
            <Label>Aadhar Number:</Label>
            <Value>{specificService.aadharCardNo}</Value>
          </DetailItem>
          <DetailItem>
            <Label>PAN Number:</Label>
            <Value>{specificService.panCardNo}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Bank Account No:</Label>
            <Value>{specificService.accountNo}</Value>
          </DetailItem>
          <DetailItem>
            <Label>IFSC Code:</Label>
            <Value>{specificService.ifscCode}</Value>
          </DetailItem>
        </ServiceDetailsSection>

        {/* Application Status */}
        <ServiceDetailsSection>
          <SectionTitle>
            <Clock size={20} /> Application Status
          </SectionTitle>
          <StatusBadge status={service.status}>
            {service.status.replace("_", " ")}
          </StatusBadge>
          <DetailItem>
            <Label>Applied On:</Label>
            <Value>{new Date(service.createdAt).toLocaleString()}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Last Updated:</Label>
            <Value>{new Date(service.updatedAt).toLocaleString()}</Value>
          </DetailItem>
        </ServiceDetailsSection>

        {/* Submitted Documents */}
        {/* <DocumentSection>
          <SectionTitle>
            <File size={20} /> Submitted Documents
          </SectionTitle>
          <DocumentItem>
            <DocumentLabel>Aadhar Card</DocumentLabel>
            <DownloadButton
              onClick={() =>
                handleDownload(specificService.aadharFile, "aadhar_card")
              }
            >
              Download
            </DownloadButton>
          </DocumentItem>
          <DocumentItem>
            <DocumentLabel>PAN Card</DocumentLabel>
            <DownloadButton
              onClick={() =>
                handleDownload(specificService.panCardFile, "pan_card")
              }
            >
              Download
            </DownloadButton>
          </DocumentItem>
          <DocumentItem>
            <DocumentLabel>Bank Passbook</DocumentLabel>
            <DownloadButton
              onClick={() =>
                handleDownload(specificService.passbookFile, "passbook")
              }
            >
              Download
            </DownloadButton>
          </DocumentItem>
        </DocumentSection> */}

        <DocumentSection>
          <SectionTitle>
            <File size={20} /> Submitted Documents
          </SectionTitle>
          <DocumentItem>
            <DocumentLabel>Aadhar Card</DocumentLabel>
            <DownloadButton
              onClick={() => handleDownload(specificService.aadharFile)}
            >
              View Document
            </DownloadButton>
          </DocumentItem>
          <DocumentItem>
            <DocumentLabel>PAN Card</DocumentLabel>
            <DownloadButton
              onClick={() => handleDownload(specificService.panCardFile)}
            >
              View Document
            </DownloadButton>
          </DocumentItem>
          <DocumentItem>
            <DocumentLabel>Bank Passbook</DocumentLabel>
            <DownloadButton
              onClick={() => handleDownload(specificService.passbookFile)}
            >
              View Document
            </DownloadButton>
          </DocumentItem>
        </DocumentSection>

        {/* Additional Uploaded Documents */}
        {service.documents && service.documents.length > 0 && (
          <DocumentSection>
            <SectionTitle>
              <FileText size={20} /> Additional Documents
            </SectionTitle>
            {service.documents.map((doc, index) => (
              <DocumentItem key={index}>
                <DocumentLabel>
                  {doc.originalName || doc.documentType}
                </DocumentLabel>
                <DownloadButton
                  onClick={() => handleDownload(doc.path, doc.originalName)}
                >
                  Download
                </DownloadButton>
              </DocumentItem>
            ))}
          </DocumentSection>
        )}

        {/* Admin Comments */}
        {comments && comments.length > 0 && (
          <CommentsSection>
            <SectionTitle>
              <MessageCircle size={20} /> Admin Comments
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
        )}
      </DetailsGrid>
    </Container>
  );
};

export default ServiceDetailsITR;
