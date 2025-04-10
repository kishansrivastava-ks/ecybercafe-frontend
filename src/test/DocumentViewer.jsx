import { useState, useEffect } from "react";
import axios from "axios";
import "./DocumentViewer.css";

const DocumentViewer = ({ documentId }) => {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/document/${documentId}`
        );
        setDocumentData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load document. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId, API_BASE_URL]);

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = `${API_BASE_URL}${url}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="document-loader">Loading document...</div>;
  }

  if (error) {
    return <div className="document-error">{error}</div>;
  }

  if (!documentData) {
    return <div className="document-error">Document not found</div>;
  }

  return (
    <div className="document-viewer">
      <div className="document-header">
        <h2>{documentData.name}</h2>
        <p>
          Created on: {new Date(documentData.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="document-images">
        <div className="document-image-container">
          <h3>Photo</h3>
          <div className="image-wrapper">
            <img
              src={`${API_BASE_URL}${documentData.photoPath}`}
              alt="Document Photo"
              className="document-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-image.png";
              }}
            />
          </div>
          <button
            className="download-button"
            onClick={() =>
              handleDownload(
                documentData.photoPath,
                documentData.photoOriginalName || "photo.webp"
              )
            }
          >
            Download Photo
          </button>
        </div>

        <div className="document-image-container">
          <h3>Signature</h3>
          <div className="image-wrapper">
            <img
              src={`${API_BASE_URL}${documentData.signaturePath}`}
              alt="Document Signature"
              className="document-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-image.png";
              }}
            />
          </div>
          <button
            className="download-button"
            onClick={() =>
              handleDownload(
                documentData.signaturePath,
                documentData.signatureOriginalName || "signature.webp"
              )
            }
          >
            Download Signature
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
